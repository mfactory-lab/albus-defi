import { lowerCase } from 'lodash-es'

export function useToken() {
  const { tokens } = useTokenStore()
  const { state: userState } = useUserStore()

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

  const tokenBalance = (token: string) => {
    return userState.tokens.find(t => [lowerCase(t.symbol), lowerCase(t.name)].includes(lowerCase(token)))?.balance ?? 0
  }

  return {
    options,
    handleSearchToken,
    tokenBalance,
  }
}
