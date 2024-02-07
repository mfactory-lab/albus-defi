import { defineStore } from 'pinia'
import type { Token } from '@/utils/tokens'
import { getTokens } from '@/utils/tokens'
import { TOKENS_DEV, TOKENS_MAIN } from '@/config'

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
  // getTokenList()

  const tokens = computed(() => {
    const tokensList = connectionStore.cluster === 'mainnet-beta' ? TOKENS_MAIN : TOKENS_DEV
    return tokensList.map(t => ({
      name: t.name,
      symbol: t.symbol,
      image: t.image,
      mint: t.mint,
      decimals: t.decimals,
    }))
  })

  const tokenByMint = (mint: string) => tokens.value.find(t => t.mint === mint)

  return {
    tokens,
    loading,
    getTokenList,
    tokenByMint,
  }
})
