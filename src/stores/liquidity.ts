import { defineStore } from 'pinia'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { lamportsToSol, showCreateDialog, showTransactionResultDialog, solToLamports } from '@/utils'

interface LiquidityState {
  slippageDialog: boolean
  slippage: number
  rate: number
  maxTokenB: number
  swapping: boolean
  active: boolean
  amountTokenA: number
  amountTokenB: number
}

export const useLiquidityStore = defineStore('liquidity', () => {
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
    rate: 0,
    maxTokenB: 0,
    amountTokenA: 0,
    amountTokenB: 0,
  })

  const calcRate = async (setFromB = false) => {
    const changedToken = Number((setFromB ? state.amountTokenA : state.amountTokenB) ?? 0)

    const poolFrom = Number(lamportsToSol(Number(swapState.value.poolBalance[swapState.value.from.mint] ?? 0), swapState.value.from.decimals))
    const poolTo = Number(lamportsToSol(Number(swapState.value.poolBalance[swapState.value.to.mint] ?? 0), swapState.value.to.decimals))

    if (changedToken === 0 || Number.isNaN(changedToken)) {
      state.amountTokenB = 0
      state.amountTokenA = 0
      state.rate = Number(poolTo) / Number(poolFrom)
      state.maxTokenB = 0
      return
    }

    const rate = setFromB ? poolFrom / poolTo : poolTo / poolFrom
    if (setFromB) {
      state.amountTokenA = rate * state.amountTokenB
    } else {
      state.amountTokenB = rate * state.amountTokenA
    }
    // state.maxTokenB = solToLamports(state.amountTokenB + (state.amountTokenB * state.slippage), swapState.value.to.decimals)
  }

  watch(
    () => swapState.value.poolBalance,
    () => calcRate(),
    { immediate: true },
  )

  function reload() {
    swapStore.loadPoolTokenAccounts()
    state.amountTokenA = 0
    state.amountTokenB = 0
  }

  async function depositBothTokens() {
    if (!userStore.certificateValid) {
      return showCreateDialog()
    }

    if (!tokenSwap.value || !publicKey.value) {
      console.log('TokenSwap is not initialized...')
      return
    }

    const authority = wallet.value!.publicKey

    if (!authority) {
      notify({ type: 'info', message: 'Please connect your wallet first' })
    }

    const tokenA = Number(solToLamports(state.amountTokenA ?? 0, swapState.value.from.decimals))
    const tokenABalance = Number(solToLamports(userStore.tokenBalance(swapState.value.from.mint) ?? 0, swapState.value.from.decimals))

    if (tokenA > tokenABalance) {
      notify({ type: 'negative', message: `Insufficient balance ${swapState.value.from.symbol}.` })
      return
    }

    const tokenB = Number(solToLamports(state.amountTokenA ?? 0, swapState.value.to.decimals))
    const tokenBBalance = Number(solToLamports(userStore.tokenBalance(swapState.value.to.mint) ?? 0, swapState.value.to.decimals))
    if (tokenB > tokenBBalance) {
      notify({ type: 'negative', message: `Insufficient balance ${swapState.value.to.symbol}.` })
      return
    }

    try {
      state.swapping = true
      // const maximumTokenA = swapState.value.direction === SwapDirection.ASC ? state.amountTokenA : state.amountTokenB
      // const maximumTokenB = swapState.value.direction === SwapDirection.ASC ? state.amountTokenB : state.amountTokenA

      const userTokenA = await getAssociatedTokenAddress(tokenSwap.value.data.tokenA, wallet.value!.publicKey)
      const userTokenB = await getAssociatedTokenAddress(tokenSwap.value.data.tokenB, wallet.value!.publicKey)
      const destination = await getAssociatedTokenAddress(tokenSwap.value.data.poolMint, wallet.value!.publicKey)

      console.log('slippage = ', state.slippage)

      const authority = swapClient.value.swapAuthority(tokenSwap.value.pubkey)

      console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority)
      console.log('tokenSwap = ', tokenSwap.value.pubkey.toBase58())
      console.log('poolMint = ', tokenSwap.value.data.poolMint.toBase58())
      console.log('poolFee = ', tokenSwap.value.data.poolFeeAccount.toBase58())
      console.log('maxTokenB = ', state.maxTokenB)
      const signature = await swapClient.value.depositAllTokenTypes({
        // proofRequest: userStore.certificate?.pubkey,
        // authority,
        tokenSwap: tokenSwap.value.pubkey,
        poolMint: tokenSwap.value.data.poolMint,
        destination,
        userTokenA,
        userTokenB,
        swapTokenA: tokenSwap.value.data.tokenA,
        swapTokenB: tokenSwap.value.data.tokenB,
        poolTokenAmount: 1000000000,
        maximumTokenA: 10000000000,
        maximumTokenB: 10000000000,
      }, { commitment: 'confirmed' })

      showTransactionResultDialog(`https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`)
      reload()
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
    calcRate,
    closeSlippage,
    openSlippage,
    depositBothTokens,
  }
})
