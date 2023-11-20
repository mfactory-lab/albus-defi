import { defineStore } from 'pinia'
import type { Token } from '@/utils/tokens'
import { getTokens } from '@/utils/tokens'
import { SOL_TOKEN, TOKENS } from '@/config'

export const useTokenStore = defineStore('token', () => {
  const connectionStore = useConnectionStore()

  const tokenList = ref<Token[]>([])
  const loading = ref(false)

  async function getTokenList() {
    if (loading.value) {
      return
    }
    console.log('getTokenList...')
    loading.value = true
    try {
      tokenList.value = await getTokens()
      console.log('Tokens:  ', tokenList.value)
    } catch (e) {
      console.error('getTokenList error: ', e)
    } finally {
      loading.value = false
    }
  }
  getTokenList()

  const tokens = computed(() => {
    return connectionStore.cluster === 'mainnet-beta'
      ? [SOL_TOKEN, ...tokenList.value.map(t => ({
          name: t.name,
          symbol: t.symbol,
          image: t.logoURI,
          mint: t.address,
        }))]
      : TOKENS.map(t => ({
        name: t.name,
        symbol: t.symbol,
        image: t.img,
        // @ts-expect-error ...
        mint: t.mint?.[connectionStore.cluster],
      }))
  })

  return {
    tokens,
    loading,
    getTokenList,
  }
})
