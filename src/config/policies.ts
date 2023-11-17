import { PublicKey } from '@solana/web3.js'

export const POOL_ADDRESS = new PublicKey('2rGkUVnvaaorW3B3MTg2j4mvvg8rb2MDZXjA74WEXkfR')

export const APP_CONFIG = {
  'mainnet-beta': {
    serviceCode: '',
    policy: {
      transfer: {
        default: '',
      },
      swap: {
        default: '',
      },
      stake: {
        default: '',
      },
    },
  },
  'devnet': {
    serviceCode: 'alphaDefi',
    policy: {
      transfer: {
        // countries Germany, Ukraine, Switzerland
        default: 'CjnpmL6Svfr3Vhpp1jVWCcNbJRxbyPY5ZQF8QiNXWXtT',
        // 18+
        usdc: 'FekBJXo2MBcesX7u2ZmT38zpnzCC4ekcAtVCkoQormtg',
        // usdt: 'Bn2XUm6UyEYxxEKDbsq51hbXTAjnbaAAruX8fExNGrnT',
      },
      swap: {
        // countries Germany, Ukraine, Switzerland
        default: 'CjnpmL6Svfr3Vhpp1jVWCcNbJRxbyPY5ZQF8QiNXWXtT',
      },
    },
  },
}
