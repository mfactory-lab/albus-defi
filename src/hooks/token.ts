export function useToken() {
  const tokenStore = useTokenStore()
  const tokensList = computed(() => tokenStore.tokens)

  const searchToken = ref('')
  function handleSearchToken(token: string) {
    searchToken.value = token
  }

  const tokens = computed(() => tokensList.value.filter(t => t.symbol.toLowerCase().includes(searchToken.value.toLocaleLowerCase())))

  return {
    tokens,
    handleSearchToken,
  }
}
