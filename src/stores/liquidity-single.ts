import { defineStore } from 'pinia'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { solToLamports } from '@/utils'

interface LiquiditySingleState {
  swapping: boolean
  active: boolean
  amountTokenA: number
}

enum SwapDirection {
  ASC,
  DESC,
}

export const useLiquiditySingleStore = defineStore('liquidity-single', () => {
  const connectionStore = useConnectionStore()
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const { notify } = useQuasar()

  const swapStore = useSwapStore()
  const tokenSwap = computed(() => swapStore.tokenSwap)
  const swapState = computed(() => swapStore.state)
  const swapClient = computed(() => swapStore.swapClient)

  const state = reactive<LiquiditySingleState>({
    swapping: false,
    active: false,
    amountTokenA: 0,
  })

  function reload() {
    swapStore.loadPoolTokenAccounts()
    state.amountTokenA = 0
  }

  async function depositSingleToken() {
    if (!tokenSwap.value || !publicKey.value) {
      console.log('TokenSwap is not initialized...')
      return
    }
    try {
      state.swapping = true

      const userSourceMint = swapState.value.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenAMint : tokenSwap.value.data.tokenBMint
      const userSource = await getAssociatedTokenAddress(userSourceMint, wallet.value!.publicKey)
      const userDestination = await getAssociatedTokenAddress(tokenSwap.value.data.poolMint, wallet.value!.publicKey)

      const sourceTokenAmount = Number(solToLamports(state.amountTokenA ?? 0, swapState.value.from.decimals))

      const signature = await swapClient.value.depositSingleTokenTypeExactAmountIn({
        tokenSwap: tokenSwap.value?.pubkey,
        poolMint: tokenSwap.value.data.poolMint,
        sourceTokenMint: userSourceMint,
        source: userSource,
        destination: userDestination,
        swapTokenA: tokenSwap.value.data.tokenA,
        swapTokenB: tokenSwap.value.data.tokenB,
        sourceTokenAmount,
        minimumPoolTokenAmount: 0,
      })

      reload()

      notify({
        message: 'Transaction confirmed',
        type: 'positive',
        actions: [{
          label: 'Explore',
          color: 'white',
          target: '_blank',
          href: `https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`,
          onClick: () => false,
        }],
      })
    } catch (e) {
      console.log(e)
    } finally {
      state.swapping = false
    }
  }

  function openSlippage() {
    state.slippageDialog = true
  }

  function closeSlippage() {
    state.slippageDialog = false
  }

  return {
    state,
    closeSlippage,
    openSlippage,
    addLiquiditySubmit,
    depositSingleToken,
  }
})
