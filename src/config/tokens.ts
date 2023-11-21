import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import usdtToken from '@/assets/img/tokens/usdt.png'

export const SOL_MINT = 'So11111111111111111111111111111111111111111'

export const SOL_TOKEN = {
  image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  inactive: false,
  mint: SOL_MINT,
  name: 'SOL',
  symbol: 'SOL',
}
export const TOKENS = [
  {
    symbol: 'sol',
    name: 'sol',
    img: solToken,
    mint: {
      'mainnet-beta': SOL_MINT,
      'testnet': SOL_MINT,
      'devnet': SOL_MINT,
    },
  },
  {
    symbol: 'usd-coin',
    name: 'usdc',
    img: usdcToken,
    mint: {
      'mainnet-beta': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      'devnet': '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    },
  },
  {
    symbol: 'tether',
    name: 'usdt',
    img: usdtToken,
    mint: {
      'mainnet-beta': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      'devnet': 'HY6uvCfBQhKANRxBcYLBK7aUva8mT7mLP2SjrLLmipza',
    },
  },
  // {
  //   symbol: PoolTokenSymbol.TOKEN_A,
  //   name: PoolTokenSymbol.TOKEN_A,
  //   img: solToken,
  // },
  // {
  //   symbol: PoolTokenSymbol.TOKEN_B,
  //   name: PoolTokenSymbol.TOKEN_B,
  //   img: usdcToken,
  // },
]
