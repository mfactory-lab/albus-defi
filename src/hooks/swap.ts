import Decimal from 'decimal.js'
import BN from 'bn.js'
import { lamportsToSol, solToLamports } from '@/utils'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'

export function useSwap() {
//   const { verifieStatus, verifiedTransferToken } = useClientStore()
  const { state: swapState, depositSingleTokenType, withdrawSingleTokenTypeExactOut, tokenSwap } = useSwapStore()

  const fromToken = reactive<SwapData>({ image: solToken, value: 'sol', label: 'sol' })
  const toToken = reactive<SwapData>({ image: usdcToken, value: 'usd-coin', label: 'usdc' })

  const state = reactive({
    from: fromToken,
    to: toToken,
    swapping: false,
    active: false,
    slippage: 0.01,
    fees: { host: 0, trade: 0 },
  })

  const changeValue = () => {
    const amountIn = solToLamports(state.from.amount ?? 0)
    if (amountIn === 0 || Number.isNaN(amountIn)) {
      state.to.value = undefined
      return
    }
    let amountOut
    if (state.from.value === PoolTokenSymbol.SOL) {
      amountOut = depositSingleTokenType(amountIn)
    } else {
      const _amountOut = new Decimal(amountIn).div(swapState.rate)
      amountOut = (new Decimal(amountIn).div(withdrawSingleTokenTypeExactOut(_amountOut.toNumber())))
        .mul(_amountOut)
        .toNumber()
    }
    state.to.value = lamportsToSol(amountOut)
  }

  async function verifieSwap() {
    // swapState.status = await verifieStatus()
    // verifiedTransferToken()
  }

  function changeDirection() {
    const { from, to } = state
    state.to = from
    state.from = to
  }

  function openSlippage() {
    swapState.slippageDialog = true
  }

  function closeSlippage() {
    swapState.slippageDialog = false
  }

  function setMax(amount: number) {
    state.from.amount = amount
  }

  watch(() => state.to, (s) => {
    if (s.amount) {
      s.amount = undefined
    }
  })

  watch(() => tokenSwap, (ts) => {
    if (!ts) {
      return
    }
    state.fees.host = new BN(ts.hostFeeNumerator).mul(new BN(ts.hostFeeDenominator)).toNumber()
    state.fees.trade = new BN(ts.tradeFeeNumerator).mul(new BN(ts.tradeFeeDenominator)).toNumber()
  })
  return {
    state,
    tokenSwap,
    swapState,
    setMax,
    closeSlippage,
    openSlippage,
    changeDirection,
    verifieSwap,
    changeValue,
  }
}

export interface SwapData {
  value?: number | string
  image: string
  balance?: number
  label: string
  amount?: number
}
