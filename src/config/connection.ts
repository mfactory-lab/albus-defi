import { type Commitment } from '@solana/web3.js'

// import { clusterApiUrl } from '@solana/web3.js'
import type { AlbusClientEnv } from '@albus-finance/sdk'
import type { Endpoint } from '@/stores'

// import { getJFRpcToken } from '@/utils/rpc'

export const ENVIRONMENT = import.meta.env.MODE as AlbusClientEnv
const isDev = import.meta.env.DEV
export const ENDPOINTS: Endpoint[] = []
// TODO: uncomment
// if (ENVIRONMENT !== 'dev') {
ENDPOINTS.push({
  id: 'jfactory-mainnet',
  name: 'JFactory RPC',
  cluster: 'mainnet-beta',
  url: 'https://marketa-1sh8m6-fast-mainnet.helius-rpc.com/',
})
// }

if (ENVIRONMENT === 'dev' || isDev) {
  ENDPOINTS.push({
    id: 'devnet',
    name: 'DevNet',
    cluster: 'devnet',
    url: 'https://jody-hlb1qh-fast-devnet.helius-rpc.com/',
  })
}

export const DEFAULT_ENDPOINT = ENDPOINTS[ENDPOINTS.length - 1] as Endpoint

/**
 * The level of commitment desired when querying state
 * <pre>
 *   'processed': Query the most recent block which has reached 1 confirmation by the connected node
 *   'confirmed': Query the most recent block which has reached 1 confirmation by the cluster
 *   'finalized': Query the most recent block which has been finalized by the cluster
 * </pre>
 */
export const DEFAULT_COMMITMENT: Commitment = 'confirmed'

export const DEFAULT_MONITOR_COMMITMENT: Commitment = 'processed'

export const DEFAULT_SEND_TIMEOUT = 15000

/**
 * Time to allow for the server to initially process a transaction (in milliseconds)
 */
export const DEFAULT_CONFIRM_TIMEOUT = 120000
