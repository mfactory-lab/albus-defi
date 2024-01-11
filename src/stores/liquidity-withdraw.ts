import { defineStore } from 'pinia'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { lamportsToSol, showCreateDialog, solToLamports } from '@/utils'
import { LP_DECIMALS } from '@/config'

interface LiquidityState {
  slippageDialog: boolean
  slippage: number
  swapping: boolean
  active: boolean
  poolAmount: number
  minAmountTokenA: number
  minAmountTokenB: number
}

export const useLiquidityWithdrawStore = defineStore('liquidity-withdraw', () => {
  const connectionStore = useConnectionStore()
  const userStore = useUserStore()
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const { notify } = useQuasar()

  const swapStore = useSwapStore()
  const tokenSwap = computed(() => swapStore.tokenSwap)
  const swapState = computed(() => swapStore.state)
  const swapClient = computed(() => swapStore.swapClient)

  const state = reactive<LiquidityState>({
    slippageDialog: false,
    swapping: false,
    active: false,
    slippage: 0.01,
    poolAmount: 0,
    minAmountTokenA: 0,
    minAmountTokenB: 0,
  })

  const calcRate = async () => {
    const rate = solToLamports(state.poolAmount, LP_DECIMALS) / swapState.value.poolTokenSupply

    if (state.poolAmount === 0 || Number.isNaN(state.poolAmount)) {
      state.minAmountTokenA = 0
      state.minAmountTokenB = 0
    }

    state.minAmountTokenA = Math.floor(rate * swapState.value.poolBalance[swapState.value.from.mint] * (1 - state.slippage))
    state.minAmountTokenB = Math.floor(rate * swapState.value.poolBalance[swapState.value.to.mint] * (1 - state.slippage))
  }

  watch(
    [
      () => swapState.value.poolBalance,
      () => state.poolAmount,
      () => state.slippage,
    ],
    () => calcRate(),
    { immediate: true },
  )

  function reload() {
    swapStore.loadPoolTokenAccounts()
    swapStore.reloadUserLP()
    state.poolAmount = 0
  }

  async function depositBothTokens() {
    if (!userStore.certificateValid) {
      return showCreateDialog()
    }

    if (!tokenSwap.value || !publicKey.value) {
      console.log('Pool is not selected...')
      return
    }

    const authority = wallet.value!.publicKey

    if (!authority) {
      notify({ type: 'info', message: 'Please connect your wallet first' })
    }

    if (state.poolAmount > swapStore.userPoolsTokens[tokenSwap.value.data.poolMint.toBase58()]) {
      notify({ type: 'negative', message: 'Insufficient LP tokens balance' })
      return
    }

    try {
      state.swapping = true
      let minimumTokenA = state.minAmountTokenA
      let minimumTokenB = state.minAmountTokenB
      let tokenA = swapState.value.from
      let tokenB = swapState.value.to
      if (tokenSwap.value.data.tokenBMint.toBase58() === swapState.value.from.mint) {
        minimumTokenA = state.minAmountTokenB
        minimumTokenB = state.minAmountTokenA
        tokenA = swapState.value.to
        tokenB = swapState.value.from
      }

      const destTokenA = await getAssociatedTokenAddress(tokenSwap.value.data.tokenAMint, wallet.value!.publicKey)
      const destTokenB = await getAssociatedTokenAddress(tokenSwap.value.data.tokenBMint, wallet.value!.publicKey)
      const source = await getAssociatedTokenAddress(tokenSwap.value.data.poolMint, wallet.value!.publicKey)

      console.log('slippage = ', state.slippage)

      const authority = swapClient.value.swapAuthority(tokenSwap.value.pubkey)

      console.log('source = ', source.toBase58())
      console.log('destTokenA = ', destTokenA.toBase58())
      console.log('destTokenB = ', destTokenB.toBase58())

      // console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority.toBase58())
      console.log('tokenSwap = ', tokenSwap.value.pubkey.toBase58())
      console.log('poolMint = ', tokenSwap.value.data.poolMint.toBase58())

      console.log('swapTokenA Mint = ', tokenSwap.value.data.tokenAMint.toBase58())
      console.log('swapTokenA = ', tokenSwap.value.data.tokenA.toBase58())
      console.log('swapTokenB Mint = ', tokenSwap.value.data.tokenBMint.toBase58())
      console.log('swapTokenB = ', tokenSwap.value.data.tokenB.toBase58())

      console.log('TokenA = ', tokenA.symbol)
      console.log('minimumTokenA = ', minimumTokenA)
      console.log('minimumTokenA = ', lamportsToSol(minimumTokenA, tokenA.decimals))
      console.log('TokenB = ', tokenB.symbol)
      console.log('minimumTokenB = ', minimumTokenB)
      console.log('minimumTokenB = ', lamportsToSol(minimumTokenB, tokenB.decimals))

      console.log('poolTokenAmount = ', state.poolAmount)
      console.log('poolTokenAmount = ', solToLamports(state.poolAmount, LP_DECIMALS))

      console.log({
        // proofRequest: userStore.certificate?.pubkey,
        // authority,
        tokenSwap: tokenSwap.value.pubkey,
        poolMint: tokenSwap.value.data.poolMint,
        poolFee: tokenSwap.value.data.poolFeeAccount,
        source,
        destTokenA,
        destTokenB,
        swapTokenA: tokenSwap.value.data.tokenA,
        swapTokenB: tokenSwap.value.data.tokenB,
        poolTokenAmount: solToLamports(state.poolAmount, LP_DECIMALS),
        minimumTokenA,
        minimumTokenB,
        // tokenAMint: tokenSwap.value.data.tokenAMint,
        // tokenBMint: tokenSwap.value.data.tokenBMint,
      })

      const signature = await swapClient.value.withdrawAllTokenTypes({
        // proofRequest: userStore.certificate?.pubkey,
        // authority,
        tokenSwap: tokenSwap.value.pubkey,
        poolMint: tokenSwap.value.data.poolMint,
        poolFee: tokenSwap.value.data.poolFeeAccount,
        source,
        destTokenA,
        destTokenB,
        swapTokenA: tokenSwap.value.data.tokenA,
        swapTokenB: tokenSwap.value.data.tokenB,
        poolTokenAmount: solToLamports(state.poolAmount, LP_DECIMALS),
        minimumTokenA,
        minimumTokenB,
        // tokenAMint: tokenSwap.value.data.tokenAMint,
        // tokenBMint: tokenSwap.value.data.tokenBMint,
      }, { commitment: 'confirmed' })

      // showTransactionResultDialog(`https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`)
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
      reload()
    } catch (e) {
      console.log(e)
      if (!`${e}`.includes('User rejected the request')) {
        notify({
          type: 'negative',
          message: `${e}`,
        })
      }
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
    depositBothTokens,
  }
})
