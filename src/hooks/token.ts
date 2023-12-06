export function useToken() {
  const tokenStore = useTokenStore()
  const tokensList = computed(() => tokenStore.tokens)

  const searchToken = ref('')
  function handleSearchToken(token: string) {
    searchToken.value = token
  }

  const filterToken = ref('')
  function handleFilterToken(token: string) {
    filterToken.value = token
  }

  const tokens = computed(() => tokensList.value
    .filter(t => t.symbol.toLowerCase().includes(searchToken.value.toLocaleLowerCase()))
    .filter(t => !filterToken.value || t.mint !== filterToken.value),
  )

  return {
    tokens,
    handleSearchToken,
    handleFilterToken,
  }
}
