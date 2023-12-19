import type { Policy } from '@albus-finance/sdk'
import type { PublicKey } from '@solana/web3.js'
import { ENVIRONMENT } from './connection'

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
        default: ENVIRONMENT === 'prod' ? '7Zes5oRAu7TCF9om8fCPstJx29nMAPQHY52u8kEnqNXr' : '21iMuKCP4gSKJfh7JT6byetCBLsvcAg9GpEVqPj2Adcw',
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
        default: 'ANGgdHwXQd9UmfZdHvMDJ6b5ATzrmTCJz4bcbZzB5a76',
        // Age
        usdc: '6c3ER8JD9Gq39AMMALZMi2Rf55QzvRcyPwNZMLn7ApSo',
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
