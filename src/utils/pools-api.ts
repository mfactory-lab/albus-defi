import axios from 'axios'
import type { Cluster } from '@solana/web3.js'
import { DEV_POOLS_API_URL, MAIN_POOLS_API_URL } from '@/config'

export interface PoolData {
  id: number
  address: string
  swapAuthority: string
  poolMint: string
  tokenAMint: string
  tokenBMint: string
  poolFeeAccount: string
  tokenA: string
  tokenB: string
  poolTokenSupply: string
  tokenABalance: string
  tokenBBalance: string
  fees: {
    hostFeeDenominator: number
    hostFeeNumerator: number
    ownerTradeFeeDenominator: number
    ownerTradeFeeNumerator: number
    ownerWithdrawFeeDenominator: number
    ownerWithdrawFeeNumerator: number
    tradeFeeDenominator: number
    tradeFeeNumerator: number
  }
  cluster: string
  updatedAt: string
  createdAt: string
  lastSignature: string
}

export interface TxData {
  poolAddress: string
  amountTokenA: string
  amountTokenB: string
  feeTokenA: string
  feeTokenB: string
  priceTokenA: number
  priceTokenB: number
  createdAt: string
  type?: string
}

export async function getPoolsStats(cluster: Cluster): Promise<PoolData[]> {
  const { data } = await axios.get(`${getApiUrl(cluster)}`)
  return data
}

export async function getPoolsTransactions(cluster: Cluster): Promise<TxData[]> {
  const { data } = await axios.get(`${getApiUrl(cluster)}/transactions?type=swap`)
  return data
}

export async function getCoinsPrice(cluster: Cluster): Promise<Record<string, number>> {
  const { data } = await axios.get(`${getApiUrl(cluster)}/coin-price`)
  return data
}

function getApiUrl(cluster: Cluster) {
  if (cluster === 'mainnet-beta') {
    return MAIN_POOLS_API_URL
  }
  return DEV_POOLS_API_URL
}
