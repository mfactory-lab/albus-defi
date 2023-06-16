export function useToken() {
  const { tokens } = useTokenStore()

  const searchToken = ref('')

  function handleSearchToken(token: string) {
    searchToken.value = token
  }

  const options = computed(() => tokens.map(t => ({
    label: t.name,
    value: t.symbol,
    symbol: t.symbol,
    image: t.img,
  })).filter(t => t.label.toLowerCase().includes(searchToken.value.toLocaleLowerCase())))

  return {
    options,
    handleSearchToken,
  }
}
