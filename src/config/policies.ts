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
        default: '7Zes5oRAu7TCF9om8fCPstJx29nMAPQHY52u8kEnqNXr',
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
        // Germany
        default: '6ZHFw4Z6A5g8ktPktzHKG7rPJHGem8HoKhxfYo9iYmhA',
        // Liveness
        usdc: 'DfmzXJY5u1VPLmG58dekQoSchhyhZRcuuHy8e3D6Wq6B',
        // 18+
        usdt: 'B6MQGcriR1XXUhs4DbHattdueqRDkfGAQ9EJHSBQbDQn',
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
