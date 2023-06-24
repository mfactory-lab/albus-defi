import BN from 'bn.js'
import { useAnchorWallet } from 'solana-wallets-vue'
import type { PublicKey } from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { getOrInitAssociatedTokenAddress, lamportsToSol, sendTransaction, solToLamports } from '@/utils'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'

enum SwapDirection {
  ASC,
  DESC,
}

export function useSwap() {
  const clientStore = useClientStore()
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
    fees: { host: 0, trade: 0 },
    direction: SwapDirection.ASC,
  })

  const changeValue = async () => {
    const amountIn = solToLamports(state.from.amount ?? 0)

    if (amountIn === 0 || Number.isNaN(amountIn)) {
      state.to.value = undefined
      return
    }

    // const amountOut = swapStore.withdrawSingleTokenTypeExactOut(amountIn, state.from.label)
    const tokenMint = state.direction === SwapDirection.ASC ? swapStore.tokenSwap?.mintA : swapStore.tokenSwap?.mintB
    const amountOut = await swapStore.calculateDependentAmount(String(tokenMint), Number(state.from.amount))
    state.to.amount = Number(lamportsToSol(Number(amountOut)))
  }

  async function swapSubmit() {
    const tokenSwap = swapStore.tokenSwap
    clientStore.state.requestStatus = await clientStore.verifieStatus()

    if (clientStore.state.requestStatus !== IProofRequestStatus.Proved) {
      return
    }
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
      const tx = new Transaction()

      const {
        userSourceMint,
        userDestinationMint,
        poolSourceAddress,
        poolDestinationAddress,
      } = swapDataByDirection()

      const userSource = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, userSourceMint, wallet.value!.publicKey)
      const userDestination = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, userDestinationMint, wallet.value!.publicKey)
      const poolSource = poolSourceAddress
      const poolDestination = poolDestinationAddress
      const hostFeeAccount = null
      const userTransferAuthority = wallet.value!.publicKey

      const sourceTokenAmount = fromAmount
      const minimumPoolTokenAmount = Math.floor(toAmount - (toAmount * state.slippage))

      const instruction = tokenSwap.swap(
        userSource,
        poolSource,
        poolDestination,
        userDestination,
        hostFeeAccount,
        userTransferAuthority,
        sourceTokenAmount,
        minimumPoolTokenAmount,
      )

      tx.add(instruction)

      await monitorTransaction(
        sendTransaction(connectionStore.connection, wallet.value!, tx.instructions),
        {
          commitment: 'finalized',
          onSuccess: reload,
        },
      )
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
      userSourceMint: direction === SwapDirection.ASC ? tokenSwap.mintA : tokenSwap.mintB,
      userDestinationMint: direction === SwapDirection.ASC ? tokenSwap.mintB : tokenSwap.mintA,
      poolSourceAddress: direction === SwapDirection.ASC ? tokenSwap.tokenAccountA : tokenSwap.tokenAccountB,
      poolDestinationAddress: direction === SwapDirection.ASC ? tokenSwap.tokenAccountB : tokenSwap.tokenAccountA,
    }
  }

  async function depositToken(tokenMint: PublicKey) {
    const tx = new Transaction()

    const userAccount = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, tokenMint, wallet.value!.publicKey)
    const poolAccount = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, swapStore.tokenSwap!.poolToken, wallet.value!.publicKey)

    const amountIn = solToLamports(5)
    const minimumPoolTokenAmount = Math.floor(amountIn - (amountIn * state.slippage))

    const instructions = swapStore.tokenSwap!.depositSingleTokenTypeExactAmountIn(
      userAccount,
      poolAccount,
      wallet.value!.publicKey,
      amountIn,
      minimumPoolTokenAmount,
    )

    tx.add(instructions)

    await monitorTransaction(
      sendTransaction(connectionStore.connection, wallet.value!, tx.instructions),
    )
  }

  async function verifieSwap() {
    // swapState.status = await verifieStatus()
    // verifiedTransferToken()
  }

  function changeDirection() {
    const { from, to } = state
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
    state.fees.host = new BN(ts.hostFeeNumerator).mul(new BN(ts.hostFeeDenominator)).toNumber()
    state.fees.trade = new BN(ts.tradeFeeNumerator).mul(new BN(ts.tradeFeeDenominator)).toNumber()
  })
  return {
    state,
    tokenSwap: swapStore.tokenSwap,
    swapState: swapStore.state,
    setMax,
    closeSlippage,
    openSlippage,
    changeDirection,
    verifieSwap,
    changeValue,
    swapSubmit,
    depositToken,
  }
}

export interface SwapData {
  value?: number | string
  image: string
  balance?: number
  label: string
  amount?: number
}
