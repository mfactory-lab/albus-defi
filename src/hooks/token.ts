export function useToken() {
  const { tokens: tokensList } = useTokenStore()
  const searchToken = ref('')

  function handleSearchToken(token: string) {
    searchToken.value = token
  }

  const tokens = computed(() => tokensList.filter(t => t.name.toLowerCase().includes(searchToken.value.toLocaleLowerCase())))

  return {
    tokens,
    handleSearchToken,
  }
}
