import { API_COLLECTOR_URL } from '~/config'

interface CoinStats {
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  circulating_supply: number
  current_price: number
  fully_diluted_valuation: null
  high_24h: number
  id: string
  image: string
  last_updated: string
  low_24h: number
  market_cap: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  market_cap_rank: number
  // max_supply: null,
  name: string
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_24h_in_currency: number
  // roi: null,
  symbol: string
  total_supply: number
  total_volume: number
}

export async function getCoinStats(): Promise<Record<string, CoinStats>> {
  const res = await fetch(`${API_COLLECTOR_URL}/coins`)
  return (await res.json()).data
}
