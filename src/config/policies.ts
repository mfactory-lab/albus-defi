import type { Policy } from '@albus-finance/sdk'
import type { PublicKey } from '@solana/web3.js'

export interface PolicyItem {
  pubkey: PublicKey
  data: Policy | null
}

export const APP_CONFIG = {
  'mainnet-beta': {
    serviceCode: 'albus',
    policy: {
      transfer: {
        // Age : Country
        default: ENVIRONMENT === 'prod' ? 'H26ynTX82BFW32Ce7S4NV1H8Q2D6YyZRVQzhoadMhgQa' : '88zfWhrwxQu9MBZCBK2iaqpsRScCSVS35KGKuNH7t6Sf',
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
    serviceCode: 'albusDefi',
    policy: {
      transfer: {
        // Country
        default: 'AVNPv4pYGK3ei1973i2PwDqhj37LjcEcucr4ziWpL3jY',
        // Age
        usdc: '649MokFTvyxUYQNQavYPVeniyeMSx3QfA4TiT3zVKd65',
      },
    },
  },
}
// serviceCode: 'alphaDefi',
// policy: {
//   transfer: {
//     // countries Germany, Ukraine, Switzerland
//     default: '6ZHFw4Z6A5g8ktPktzHKG7rPJHGem8HoKhxfYo9iYmhA',
//     // 22 - 55
//     usdc: 'DfmzXJY5u1VPLmG58dekQoSchhyhZRcuuHy8e3D6Wq6B',
//     // 18+
//     usdt: 'B6MQGcriR1XXUhs4DbHattdueqRDkfGAQ9EJHSBQbDQn',
//   },
// },
