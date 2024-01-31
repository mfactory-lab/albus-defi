import axios from 'axios'
import { POOLS_API_URL } from '@/config'

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

export async function getPoolsStats(): Promise<PoolData[]> {
  const { data } = await axios.get(`${POOLS_API_URL}`)
  return data
}

export async function getPoolsTransactions(): Promise<TxData[]> {
  const { data } = await axios.get(`${POOLS_API_URL}/transactions?type=swap`)
  return data
}

export async function getCoinsPrice(): Promise<Record<string, number>> {
  const { data } = await axios.get(`${POOLS_API_URL}/coin-price`)
  return data
}
