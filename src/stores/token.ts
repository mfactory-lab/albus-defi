import { defineStore } from 'pinia'
import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import usdtToken from '@/assets/img/tokens/usdt.png'

export const useTokenStore = defineStore('token', () => {
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
    tokens,
  }
})