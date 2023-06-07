import { defineStore } from 'pinia'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'

export const useSwapStore = defineStore('swap', () => {
  const fromToken = reactive<SwapData>({ image: solToken, value: 'sol', label: 'sol' })
  const toToken = reactive<SwapData>({ image: usdcToken, value: 'usd-coin', label: 'usdc' })

  const state = reactive<SwapState>({
    from: fromToken,
    to: toToken,
    swapping: false,
    active: false,
    loading: false,
    slippage: 0.01,
    slippageDialog: false,
  })

  function changeDirection() {
    const { from, to } = state
    state.to = from
    state.from = to
  }

  function openSlippage() {
    state.slippageDialog = true
  }

  function closeSlippage() {
    state.slippageDialog = false
  }
  return {
    state,
    changeDirection,
    openSlippage,
    closeSlippage,
  }
})

export interface SwapState {
  from: SwapData
  to: SwapData
  swapping: boolean
  active: boolean
  loading: boolean
  slippage: number
  slippageDialog: boolean
}

export interface SwapData {
  value?: number | string
  image: string
  balance?: number
  label: string
  amount?: number
}
