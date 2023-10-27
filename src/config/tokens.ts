import solToken from '@/assets/img/tokens/sol.png'
import usdcToken from '@/assets/img/tokens/usdc.png'
import usdtToken from '@/assets/img/tokens/usdt.png'

export const TOKENS = [
  {
    symbol: 'sol',
    name: 'sol',
    img: solToken,
    mint: {
      'mainnet-beta': 'So11111111111111111111111111111111111111111',
      'testnet': 'So11111111111111111111111111111111111111111',
      'devnet': 'So11111111111111111111111111111111111111111',
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
