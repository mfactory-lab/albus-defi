import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import usdtToken from '@/assets/img/tokens/usdt.png'

export enum PoolTokenSymbol {
  TOKEN_A = 'TOKEN_A',
  TOKEN_B = 'TOKEN_B',
  TOKEN_C = 'TOKEN_C',
}

export interface TokenData {
  symbol: string
  image: string
  name: string
  mint: string
  decimals: number
  amount?: number
  balance?: number
}

export const SOL_MINT = 'So11111111111111111111111111111111111111111'
export const WRAPPED_SOL_MINT = 'So11111111111111111111111111111111111111112'
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const JSOL_MINT = '7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn'

export const USDC_TOKEN_MAIN = {
  symbol: 'USDC',
  name: 'USD Coin',
  image: usdcToken,
  inactive: false,
  mint: USDC_MINT,
  decimals: 6,
}

export const JSOL_TOKEN_MAIN = {
  symbol: 'JSOL',
  name: 'JPOOL Solana Token',
  image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn/logo.svg',
  inactive: false,
  mint: JSOL_MINT,
  decimals: 9,
}

export const SOL_TOKEN = {
  symbol: 'SOL',
  name: 'SOL',
  image: solToken,
  mint: SOL_MINT,
  decimals: 9,
}

export const WRAPPED_SOL_TOKEN = {
  symbol: 'SOL',
  name: 'SOL',
  image: solToken,
  mint: WRAPPED_SOL_MINT,
  decimals: 9,
}

export const USDC_TOKEN_DEV = {
  symbol: 'usdc',
  name: 'usdc',
  image: usdcToken,
  decimals: 6,
  mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
}

export const USDT_TOKEN_DEV = {
  symbol: 'tether',
  name: 'usdt',
  image: usdtToken,
  decimals: 6,
  mint: 'HY6uvCfBQhKANRxBcYLBK7aUva8mT7mLP2SjrLLmipza',
}

export const TOKEN_A = {
  symbol: PoolTokenSymbol.TOKEN_A,
  name: PoolTokenSymbol.TOKEN_A,
  image: solToken,
  decimals: 9,
  mint: '9pDKaLNAMrA8GHqn2DEJMCkYaBbDVFaX6wqiNJcTJLF1',
}

export const TOKEN_B = {
  symbol: PoolTokenSymbol.TOKEN_B,
  name: PoolTokenSymbol.TOKEN_B,
  image: usdcToken,
  decimals: 9,
  mint: '6rdejLXbi2Ws2z3Ff1wRhRS9WqrXRDuM8YpSkiektRgw',
}

export const TOKEN_C = {
  symbol: PoolTokenSymbol.TOKEN_C,
  name: PoolTokenSymbol.TOKEN_C,
  image: usdtToken,
  decimals: 9,
  mint: 'EkXuCiyaoToaK1VKFNrziSx9Nj171EJ2V7ksMtB6JKtW',
}

export const TOKENS_DEV = [
  TOKEN_A,
  TOKEN_B,
  SOL_TOKEN,
  WRAPPED_SOL_TOKEN,
  USDC_TOKEN_DEV,
  USDT_TOKEN_DEV,
  TOKEN_C,
]

export const TOKENS_MAIN = [
  SOL_TOKEN,
  WRAPPED_SOL_TOKEN,
  USDC_TOKEN_MAIN,
  JSOL_TOKEN_MAIN,
]
