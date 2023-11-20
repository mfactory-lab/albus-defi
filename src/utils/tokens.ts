import axios from 'axios'

export async function getTokens(): Promise<Token[]> {
  const { data } = await axios.get('https://token.jup.ag/all')
  return data
}

export interface Token {
  address: string
  chainId: number
  decimals: number
  logoURI: string
  name: string
  symbol: string
  tags: string[]
  extensions: Record<string, string>
}
