import { defineStore } from 'pinia'
import type { SwapData } from './swap'
import solToken from '@/assets/img/tokens/sol.png'

export const useTransferStore = defineStore('transfer', () => {
  const token = reactive<SwapData>({ image: solToken, value: 'sol', label: 'sol', amount: 0 })

  const state = reactive<TransferState>({
    address: '',
    balance: 0,
    value: undefined,
    loading: false,
    active: false,
    token,
  })

  return {
    state,
  }
})

interface TransferState {
  address: string
  balance: number
  value?: number
  loading: boolean
  active: boolean
  token: SwapData
}
