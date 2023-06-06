import { defineStore } from 'pinia'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import usdtToken from '@/assets/img/tokens/usdt.png'

export const useTransfer = defineStore('transfer', () => {
  const state = reactive<TransferState>({
    address: '',
    balance: 0,
    value: undefined,
    loading: false,
    active: false,
  })

  const tokens = [
    {
      symbol: 'sol',
      name: 'sol',
      img: solToken,
    },
    {
      symbol: 'usd-coin',
      name: 'usdc',
      img: usdcToken,
    },
    {
      symbol: 'ether',
      name: 'usdt',
      img: usdtToken,
    },
  ]

  return {
    state,
    tokens,
  }
})

interface TransferState {
  address: string
  balance: number
  value?: number
  loading: boolean
  active: boolean
}
