import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import usdtToken from '@/assets/img/tokens/usdt.png'

export enum PoolTokenSymbol {
  TOKEN_A = 'TOKEN_A',
  TOKEN_B = 'TOKEN_B',
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

export const SOL_TOKEN = {
  symbol: 'SOL',
  name: 'SOL',
  image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  inactive: false,
  mint: SOL_MINT,
  decimals: 9,
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

export const TOKENS = [
  {
    symbol: 'sol',
    name: 'sol',
    image: solToken,
    decimals: 9,
    mint: SOL_MINT,
  },
  {
    symbol: 'usd-coin',
    name: 'usdc',
    image: usdcToken,
    decimals: 6,
    mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  },
  {
    symbol: 'tether',
    name: 'usdt',
    image: usdtToken,
    decimals: 6,
    mint: 'HY6uvCfBQhKANRxBcYLBK7aUva8mT7mLP2SjrLLmipza',
  },
  TOKEN_A,
  TOKEN_B,
]
