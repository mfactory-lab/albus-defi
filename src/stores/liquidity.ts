import { defineStore } from 'pinia'
import { type PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import type { TokenSwap } from '@albus-finance/swap-sdk'
import { formatBalance, lamportsToSol, showCreateDialog, showTransactionResultDialog, solToLamports } from '@/utils'

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

export interface SwapPool {
  pubkey: PublicKey
  data: TokenSwap
}

enum SwapDirection {
  ASC,
  DESC,
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

  const calcRate = async () => {
    const fromAmount = Number(state.amountTokenA ?? 0)

    const poolFrom = lamportsToSol(Number(swapState.value.poolBalance[swapState.value.from.mint] ?? 0), swapState.value.from.decimals)
    const poolTo = lamportsToSol(Number(swapState.value.poolBalance[swapState.value.to.mint] ?? 0), swapState.value.to.decimals)

    if (fromAmount === 0 || Number.isNaN(fromAmount)) {
      state.amountTokenB = 0
      state.rate = Number(poolTo) / Number(poolFrom)
      state.maxTokenB = 0
      return
    }

    const toAmount = poolTo - (poolFrom * poolTo / (poolFrom + fromAmount))
    state.rate = fromAmount ? toAmount / fromAmount : poolTo / poolFrom
    state.amountTokenB = toAmount ? Number(formatBalance(toAmount * (1 - swapState.value.fees.ownerTrade - swapState.value.fees.trade), swapState.value.to.decimals)) : 0
    state.maxTokenB = solToLamports(state.amountTokenB + (state.amountTokenB * state.slippage), swapState.value.to.decimals)
  }

  watch(
    [
      () => swapState.value.direction,
      () => swapState.value.from.amount,
      () => swapState.value.poolBalance,
    ],
    calcRate,
    { immediate: true },
  )

  function reload() {
    swapStore.loadPoolTokenAccounts()
    state.amountTokenA = 0
    state.amountTokenB = 0
  }

  async function addLiquiditySubmit() {
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

    const fromAmount = Number(solToLamports(state.amountTokenA ?? 0, swapState.value.from.decimals))
    const fromBalance = Number(solToLamports(userStore.tokenBalance(swapState.value.from.mint) ?? 0, swapState.value.from.decimals))
    const toAmount = Number(solToLamports(state.amountTokenB ?? 0, swapState.value.to.decimals))

    if (fromAmount > fromBalance) {
      notify({ type: 'negative', message: 'Insufficient balance.' })
      return
    }

    try {
      state.swapping = true

      const userSourceMint = swapState.value.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenAMint : tokenSwap.value.data.tokenBMint
      const userDestinationMint = swapState.value.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenBMint : tokenSwap.value.data.tokenAMint
      const poolSourceAddress = swapState.value.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenA : tokenSwap.value.data.tokenB
      const poolDestinationAddress = swapState.value.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenB : tokenSwap.value.data.tokenA
      console.log('userSourceMint = ', userSourceMint.toBase58())
      console.log('userDestinationMint = ', userDestinationMint.toBase58())

      console.log('userSourceMint = ', userSourceMint.toBase58())
      console.log('userDestinationMint = ', userDestinationMint.toBase58())

      const userSource = await getAssociatedTokenAddress(userSourceMint, wallet.value!.publicKey)
      const userDestination = await getAssociatedTokenAddress(userDestinationMint, wallet.value!.publicKey)
      const sourceTokenAmount = fromAmount

      console.log('toAmount = ', toAmount)
      console.log('slippage = ', state.slippage)
      console.log('slippage 2 = ', toAmount * state.slippage)

      const authority = swapClient.value.swapAuthority(tokenSwap.value.pubkey)

      console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority)
      console.log('tokenSwap = ', tokenSwap.value.pubkey.toBase58())
      console.log('userSource = ', userSource.toBase58())
      console.log('userDestination = ', userDestination.toBase58())
      console.log('poolSource = ', poolSourceAddress.toBase58())
      console.log('poolDestination = ', poolDestinationAddress.toBase58())
      console.log('poolMint = ', tokenSwap.value.data.poolMint.toBase58())
      console.log('poolFee = ', tokenSwap.value.data.poolFeeAccount.toBase58())
      console.log('amountIn = ', sourceTokenAmount)
      console.log('maxTokenB = ', state.maxTokenB)
      const signature = await swapClient.value.swap({
        proofRequest: userStore.certificate?.pubkey,
        authority,
        tokenSwap: tokenSwap.value.pubkey,
        userSource,
        userDestination,
        poolSource: poolSourceAddress,
        poolDestination: poolDestinationAddress,
        poolMint: tokenSwap.value.data.poolMint,
        poolFee: tokenSwap.value.data.poolFeeAccount,
        amountIn: sourceTokenAmount,
        minimumAmountOut: state.maxTokenB,
        // hostFeeAccount: undefined,
        sourceTokenMint: userSourceMint,
        destinationTokenMint: userDestinationMint,
      }, { commitment: 'confirmed' })

      showTransactionResultDialog(`https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`)
      reload()
    } catch (e) {
      console.log(e)
    } finally {
      state.swapping = false
    }
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
