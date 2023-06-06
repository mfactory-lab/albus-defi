import { defineStore } from 'pinia'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'

export const useSwap = defineStore('swap', () => {
  const fromToken = reactive<SwapData>({ symbol: 'SOL', image: solToken, value: 0 })
  const toToken = reactive<SwapData>({ symbol: 'USDC', image: usdcToken, value: 0 })

  const state = reactive<SwapState>({
    from: fromToken,
    to: toToken,
    swapping: false,
    active: false,
    loading: false,
    slippage: 0.01,
  })

  function changeDirection() {
    const { from, to } = state
    state.to = from
    state.from = to
  }
  return {
    state,
    changeDirection,
  }
})

export interface SwapState {
  from: SwapData
  to: SwapData
  swapping: boolean
  active: boolean
  loading: boolean
  slippage: number
}

export interface SwapData {
  value?: number | string
  symbol: string
  image: string
  balance?: number
}
