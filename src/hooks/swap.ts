import BN from 'bn.js'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Transaction } from '@solana/web3.js'
import { getOrInitAssociatedTokenAddress, lamportsToSol, sendTransaction, solToLamports } from '@/utils'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import { POOL_ADDRESS } from '@/config'

enum SwapDirection {
  ASC,
  DESC,
}

export function useSwap() {
  const userStore = useUserStore()
  const swapStore = useSwapStore()
  const wallet = useAnchorWallet()
  const connectionStore = useConnectionStore()
  const { monitorTransaction } = useMonitorTransaction()
  const { notify } = useQuasar()

  const fromToken = reactive<SwapData>({ image: solToken, value: PoolTokenSymbol.TOKEN_A, label: PoolTokenSymbol.TOKEN_A })
  const toToken = reactive<SwapData>({ image: usdcToken, value: PoolTokenSymbol.TOKEN_B, label: PoolTokenSymbol.TOKEN_B })

  const state = reactive({
    from: fromToken,
    to: toToken,
    swapping: false,
    active: false,
    slippage: 0.01,
    rate: 0,
    fees: { host: 0, trade: 0 },
    direction: SwapDirection.ASC,
  })

  /**
   * Get the amount of pool tokens for the deposited amount of token A or B.
   *
   * @see https://github.com/solana-labs/solana-program-library/blob/master/token-swap/program/src/curve/constant_product.rs#L112
   * @param {number} amountIn In lamports
   */
  const changeValue = async () => {
    // TODO: solToLamports ???
    const fromAmount = solToLamports(state.from.amount ?? 0)

    if (fromAmount === 0 || Number.isNaN(fromAmount)) {
      return state.to.amount = 0
    }

    const poolFrom = Number(swapStore.state.poolBalance[state.from.label] ?? 0)
    const poolTo = Number(swapStore.state.poolBalance[state.to.label] ?? 0)

    const toAmount = poolTo - (poolFrom * poolTo / (poolFrom + fromAmount))
    state.to.amount = lamportsToSol(toAmount ?? 0)
    state.rate = fromAmount ? toAmount / fromAmount : poolTo / poolFrom
  }

  watch(
    [
      () => state.from.amount,
      () => swapStore.state.poolBalance,
    ],
    changeValue,
    { immediate: true },
  )

  const minimumReceived = computed(() => {
    const toAmount = Number(solToLamports(state.to.amount ?? 0))
    return Math.floor(toAmount - (toAmount * state.slippage))
  })

  async function swapSubmit() {
    const tokenSwap = swapStore.tokenSwap
    // if (!userStore.certificateValid) {
    //   return showCreateDialog()
    // }

    if (!tokenSwap) {
      console.log('TokenSwap is not initialized...')
      return
    }

    const authority = wallet.value!.publicKey

    if (!authority) {
      notify({ type: 'info', message: 'Please connect your wallet first' })
    }

    const fromAmount = Number(solToLamports(state.from.amount ?? 0))
    const fromBalance = Number(swapStore.state.userBalance[state.from.label] ?? 0)
    const toAmount = Number(solToLamports(state.to.amount ?? 0))

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

      const tx = new Transaction()

      const userSource = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, userSourceMint, wallet.value!.publicKey)
      const userDestination = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, userDestinationMint, wallet.value!.publicKey)

      if (tx.instructions.length > 0) {
        await monitorTransaction(
          sendTransaction(connectionStore.connection, wallet.value!, tx.instructions),
          {
            commitment: 'finalized',
            onSuccess: reload,
          },
        )
      }

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
        // hostFeeAccount: undefined,
        amountIn: sourceTokenAmount,
        minimumAmountOut: minimumReceived.value,
      })
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
    swapStore.loadUserTokenAccounts()
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
    state.fees.host = new BN(ts.fees.hostFeeNumerator).mul(new BN(ts.fees.hostFeeDenominator)).toNumber()
    state.fees.trade = new BN(ts.fees.tradeFeeNumerator).mul(new BN(ts.fees.tradeFeeDenominator)).toNumber()
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

export interface SwapData {
  value?: number | string
  image: string
  balance?: number
  label: string
  amount?: number
}
