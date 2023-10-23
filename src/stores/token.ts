import { defineStore } from 'pinia'
import { TOKENS } from '@/config'

export const useTokenStore = defineStore('token', () => {
  const connectionStore = useConnectionStore()

  const tokens = computed(() => TOKENS.map(t => ({
    label: t.name,
    value: t.symbol,
    name: t.name,
    symbol: t.symbol,
    image: t.img,
    // @ts-expect-error ...
    mint: t.mint?.[connectionStore.cluster],
  })))

  return {
    tokens,
  }
})
