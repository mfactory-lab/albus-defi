import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { divideBnToNumber, lamportsToSol, showCreateDialog, solToLamports } from '@/utils'
import type { TokenData } from '@/config'
import { POOL_ADDRESS, TOKEN_A, TOKEN_B } from '@/config'

enum SwapDirection {
  ASC,
  DESC,
}

export function useSwap() {
  const userStore = useUserStore()
  const swapStore = useSwapStore()
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const { notify } = useQuasar()

  const state = reactive<SwapState>({
    from: TOKEN_A,
    to: TOKEN_B,
    swapping: false,
    active: false,
    slippage: 0.01,
    rate: 0,
    impact: 0,
    fees: {
      host: 0,
      trade: 0,
      ownerTrade: 0,
      ownerWithdraw: 0,
    },
    direction: SwapDirection.ASC,
  })

  /**
   * Get the amount of pool tokens for the deposited amount of token A or B.
   *
   * @see https://github.com/solana-labs/solana-program-library/blob/master/token-swap/program/src/curve/constant_product.rs#L112
   * @param {number} amountIn In lamports
   */
  const calcRate = async () => {
    const fromAmount = solToLamports(state.from.amount ?? 0, state.from.decimals)

    const poolFrom = Number(swapStore.state.poolBalance[state.from.mint] ?? 0)
    const poolTo = Number(swapStore.state.poolBalance[state.to.mint] ?? 0)

    if (fromAmount === 0 || Number.isNaN(fromAmount)) {
      state.to.amount = 0
      state.rate = poolTo / poolFrom
      state.impact = 0
      return
    }

    console.log(state.fees)
    const toAmount = poolTo - (poolFrom * poolTo / (poolFrom + fromAmount))
    state.rate = fromAmount ? toAmount / fromAmount : poolTo / poolFrom
    state.to.amount = lamportsToSol(toAmount ? toAmount * (1 - state.fees.ownerTrade - state.fees.trade) : 0, state.to.decimals)
    state.impact = fromAmount ? 1 - (toAmount / fromAmount) / (poolTo / poolFrom) : 0
  }

  watch(
    [
      () => state.from.amount,
      () => swapStore.state.poolBalance,
    ],
    calcRate,
    { immediate: true },
  )

  const minimumReceived = computed(() => {
    const toAmount = Number(solToLamports(state.to.amount ?? 0, state.to.decimals))
    return Math.floor(toAmount - (toAmount * state.slippage))
  })

  async function swapSubmit() {
    const tokenSwap = swapStore.tokenSwap
    if (!userStore.certificateValid) {
      return showCreateDialog()
    }

    if (!tokenSwap || !publicKey.value) {
      console.log('TokenSwap is not initialized...')
      return
    }

    const authority = wallet.value!.publicKey

    if (!authority) {
      notify({ type: 'info', message: 'Please connect your wallet first' })
    }

    const fromAmount = Number(solToLamports(state.from.amount ?? 0, state.from.decimals))
    const fromBalance = Number(solToLamports(userStore.tokenBalance(state.from.mint) ?? 0, state.from.decimals))
    const toAmount = Number(solToLamports(state.to.amount ?? 0, state.to.decimals))

    if (fromAmount > fromBalance) {
      notify({ type: 'negative', message: 'Insufficient balance.' })
      return
    }

    try {
      state.swapping = true
      const {
        userSourceMint,
        userDestinationMint,
        poolSourceAddress,
        poolDestinationAddress,
      } = swapDataByDirection()

      const userSource = await getAssociatedTokenAddress(userSourceMint, wallet.value!.publicKey)
      const userDestination = await getAssociatedTokenAddress(userDestinationMint, wallet.value!.publicKey)
      const sourceTokenAmount = fromAmount

      console.log('toAmount = ', toAmount)
      console.log('slippage = ', state.slippage)
      console.log('slippage 2 = ', toAmount * state.slippage)

      const authority = swapStore.swapClient.swapAuthority(POOL_ADDRESS)

      console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority)
      console.log('tokenSwap = ', POOL_ADDRESS.toBase58())
      console.log('userSource = ', userSource.toBase58())
      console.log('userDestination = ', userDestination.toBase58())
      console.log('poolSource = ', poolSourceAddress.toBase58())
      console.log('poolDestination = ', poolDestinationAddress.toBase58())
      console.log('poolMint = ', tokenSwap.poolMint.toBase58())
      console.log('poolFee = ', tokenSwap.poolFeeAccount.toBase58())
      console.log('amountIn = ', sourceTokenAmount)
      console.log('minimumAmountOut = ', minimumReceived.value)
      await swapStore.swapClient.swap({
        proofRequest: userStore.certificate?.pubkey,
        authority,
        tokenSwap: POOL_ADDRESS,
        userSource,
        userDestination,
        poolSource: poolSourceAddress,
        poolDestination: poolDestinationAddress,
        poolMint: tokenSwap.poolMint,
        poolFee: tokenSwap.poolFeeAccount,
        amountIn: sourceTokenAmount,
        minimumAmountOut: minimumReceived.value,
        // hostFeeAccount: undefined,
        receiver: publicKey.value,
        destinationTokenMint: userDestinationMint,
      }, { commitment: 'confirmed' })
      reload()
    } catch (e) {
      console.log(e)
    } finally {
      state.swapping = false
    }
  }

  function swapDataByDirection() {
    const tokenSwap = swapStore.tokenSwap!
    const direction = state.direction
    return {
      userSourceMint: direction === SwapDirection.ASC ? tokenSwap.tokenAMint : tokenSwap.tokenBMint,
      userDestinationMint: direction === SwapDirection.ASC ? tokenSwap.tokenBMint : tokenSwap.tokenAMint,
      poolSourceAddress: direction === SwapDirection.ASC ? tokenSwap.tokenA : tokenSwap.tokenB,
      poolDestinationAddress: direction === SwapDirection.ASC ? tokenSwap.tokenB : tokenSwap.tokenA,
    }
  }

  function changeDirection() {
    const { from, to } = state
    state.rate = 0
    state.to = { ...from, amount: undefined }
    state.from = { ...to, amount: undefined }
    state.direction = state.direction === SwapDirection.ASC ? SwapDirection.DESC : SwapDirection.ASC
  }

  function openSlippage() {
    swapStore.state.slippageDialog = true
  }

  function closeSlippage() {
    swapStore.state.slippageDialog = false
  }

  function setMax(amount: number) {
    state.from.amount = amount
  }

  function reload() {
    swapStore.loadPoolTokenAccounts()
    state.from.amount = undefined
    state.to.amount = undefined
  }

  watch(() => wallet.value?.publicKey, (p) => {
    if (!p) {
      reload()
    }
  })

  watch(() => state.to, (s) => {
    if (s.amount) {
      s.amount = undefined
    }
  })

  watch(() => swapStore.tokenSwap, (ts) => {
    if (!ts) {
      return
    }
    state.fees.host = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.hostFeeNumerator,
      ts.fees.hostFeeDenominator,
    )
    state.fees.ownerTrade = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.ownerTradeFeeNumerator,
      ts.fees.ownerTradeFeeDenominator,
    )
    state.fees.ownerWithdraw = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.ownerWithdrawFeeNumerator,
      ts.fees.ownerWithdrawFeeDenominator,
    )
    state.fees.trade = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.tradeFeeNumerator,
      ts.fees.tradeFeeDenominator,
    )
  })
  return {
    state,
    tokenSwap: swapStore.tokenSwap,
    swapState: swapStore.state,
    minimumReceived,
    setMax,
    closeSlippage,
    openSlippage,
    changeDirection,
    swapSubmit,
  }
}

interface PoolFees {
  host: number
  trade: number
  ownerTrade: number
  ownerWithdraw: number
}

interface SwapState {
  from: TokenData
  to: TokenData
  slippage: number
  rate: number
  impact: number
  swapping: boolean
  active: boolean
  fees: PoolFees
  direction: SwapDirection
}
