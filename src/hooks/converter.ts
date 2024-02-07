import type { TokenData } from '@/config'

export function useConverter() {
  const { state } = useConverterStore()

  function setToken(t: { [key: string]: any }) {
    console.log('set token ======== ', t)
    state.token = t
  }

  function handleSearchToken(token: string) {
    state.searchToken = token
  }

  const options = computed(() => {
    const tokens: TokenData[] = state.pairs.map((p) => {
      const token = Object.entries(p.tokensMetadata)[0]
      return { ...token[1], mint: token[0], publicKey: p.publicKey }
    })
    /*     const t = [tokens, {
      name: 'Security Second Token',
      symbol: 'SST2',
      description: 'Security Albus token',
      seller_fee_basis_points: 500,
      external_url: 'https://app.albus.finance',
      image: 'https://arweave.net/Z-h4U6izy-JCuGVMxzv1rzOA_LJ8j1hUqwTNtW-h0Hc',
    }] */
    const filterTokens = tokens.flat().filter(_t => _t.symbol.toLowerCase().includes(state.searchToken.toLowerCase()))
    return filterTokens
  })

  watch(options, (o) => {
    if (o.length !== 0 && !state.token) {
      setToken(o[0])
    }
  }, { immediate: true })
  return {
    options,
    setToken,
    handleSearchToken,
  }
}
