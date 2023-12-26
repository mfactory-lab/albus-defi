import { defineStore } from 'pinia'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { formatBalance, lamportsToSol, solToLamports } from '@/utils'

interface LiquidityState {
  slippageDialog: boolean
  slippage: number
  rate: number
  swapping: boolean
  active: boolean
  poolAmount: number
  amountTokenA: number
  amountTokenB: number
  maxAmountTokenA: number
  maxAmountTokenB: number
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
    poolAmount: 0,
    amountTokenA: 0,
    amountTokenB: 0,
    maxAmountTokenA: 0,
    maxAmountTokenB: 0,
  })

  const calcRate = async (setFromB = false) => {
    console.log('calcRate ====== ')
    const changedToken = Number((setFromB ? state.amountTokenB : state.amountTokenA) ?? 0)
    console.log('calcRate changedToken ====== ', changedToken)

    const poolFrom = Number(lamportsToSol(Number(swapState.value.poolBalance[swapState.value.from.mint] ?? 0), swapState.value.from.decimals))
    const poolTo = Number(lamportsToSol(Number(swapState.value.poolBalance[swapState.value.to.mint] ?? 0), swapState.value.to.decimals))
    const rate = setFromB ? poolFrom / poolTo : poolTo / poolFrom

    if (changedToken === 0 || Number.isNaN(changedToken)) {
      console.log('calcRate clear ====== ')
      state.poolAmount = 0
      if (setFromB) {
        state.amountTokenA = 0
        state.maxAmountTokenA = 0
      } else {
        state.amountTokenB = 0
        state.maxAmountTokenB = 0
      }
      return
    }

    console.log('calcRate rate ====== ', rate)
    if (setFromB) {
      state.amountTokenA = Number(formatBalance(rate * state.amountTokenB, swapState.value.to.decimals))
    } else {
      state.amountTokenB = Number(formatBalance(rate * state.amountTokenA, swapState.value.from.decimals))
    }
    state.maxAmountTokenA = state.amountTokenA * (1 + state.slippage)
    state.maxAmountTokenB = state.amountTokenB * (1 + state.slippage)

    const amountTokenA = state.amountTokenA
    const tokenA = swapState.value.from
    state.poolAmount = Math.floor(solToLamports(amountTokenA, tokenA.decimals) / swapState.value.poolBalance[tokenA.mint] * swapState.value.poolTokenSupply)
  }

  watch(
    [
      () => swapState.value.poolBalance,
      () => state.slippage,
    ],
    () => calcRate(),
    { immediate: true },
  )

  function reload() {
    swapStore.loadPoolTokenAccounts()
    state.maxAmountTokenA = 0
    state.maxAmountTokenB = 0
    state.amountTokenA = 0
    state.amountTokenB = 0
  }

  async function depositBothTokens() {
    // if (!userStore.certificateValid) {
    //   return showCreateDialog()
    // }

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
      let amountTokenA = state.amountTokenA
      let amountTokenB = state.amountTokenB
      let tokenA = swapState.value.from
      let tokenB = swapState.value.to
      if (tokenSwap.value.data.tokenBMint.toBase58() === swapState.value.from.mint) {
        amountTokenA = state.amountTokenB
        amountTokenB = state.amountTokenA
        tokenA = swapState.value.to
        tokenB = swapState.value.from
      }

      const userTokenA = await getAssociatedTokenAddress(tokenSwap.value.data.tokenAMint, wallet.value!.publicKey)
      const userTokenB = await getAssociatedTokenAddress(tokenSwap.value.data.tokenBMint, wallet.value!.publicKey)
      const destination = await getAssociatedTokenAddress(tokenSwap.value.data.poolMint, wallet.value!.publicKey)

      console.log('slippage = ', state.slippage)

      const authority = swapClient.value.swapAuthority(tokenSwap.value.pubkey)

      console.log('destination = ', destination.toBase58())
      console.log('userTokenA = ', userTokenA.toBase58())
      console.log('userTokenB = ', userTokenB.toBase58())

      // console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority.toBase58())
      console.log('tokenSwap = ', tokenSwap.value.pubkey.toBase58())
      console.log('poolMint = ', tokenSwap.value.data.poolMint.toBase58())

      console.log('swapTokenA Mint = ', tokenSwap.value.data.tokenAMint.toBase58())
      console.log('swapTokenA = ', tokenSwap.value.data.tokenA.toBase58())
      console.log('swapTokenB Mint = ', tokenSwap.value.data.tokenBMint.toBase58())
      console.log('swapTokenB = ', tokenSwap.value.data.tokenB.toBase58())

      console.log('TokenA = ', tokenA.symbol)
      console.log('maximumTokenA = ', amountTokenA)
      console.log('maximumTokenA = ', solToLamports(amountTokenA, tokenA.decimals))
      console.log('TokenB = ', tokenB.symbol)
      console.log('maximumTokenB = ', amountTokenB)
      console.log('maximumTokenB = ', solToLamports(amountTokenB, tokenB.decimals))

      console.log('poolTokenAmount = ', state.poolAmount)

      console.log({
        tokenSwap: tokenSwap.value.pubkey.toBase58(),
        poolMint: tokenSwap.value.data.poolMint.toBase58(),
        destination: destination.toBase58(),
        userTokenA: userTokenA.toBase58(),
        userTokenB: userTokenB.toBase58(),
        swapTokenA: tokenSwap.value.data.tokenA.toBase58(),
        swapTokenB: tokenSwap.value.data.tokenB.toBase58(),
        poolTokenAmount: state.poolAmount,
        maximumTokenA: Math.floor(solToLamports(amountTokenA, tokenA.decimals) * (1 + state.slippage)),
        maximumTokenB: Math.floor(solToLamports(amountTokenB, tokenB.decimals) * (1 + state.slippage)),
      })

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
        poolTokenAmount: state.poolAmount,
        maximumTokenA: Math.floor(solToLamports(amountTokenA, tokenA.decimals) * (1 + state.slippage)),
        maximumTokenB: Math.floor(solToLamports(amountTokenB, tokenB.decimals) * (1 + state.slippage)),
        tokenAMint: tokenSwap.value.data.tokenAMint,
        tokenBMint: tokenSwap.value.data.tokenBMint,
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
