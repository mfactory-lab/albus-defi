import { type Commitment } from '@solana/web3.js'

// import { clusterApiUrl } from '@solana/web3.js'
import type { Endpoint } from '@/stores'
import { getJFRpcToken } from '@/utils/rpc'

const mode = import.meta.env.MODE
const isDev = import.meta.env.DEV
export const ENDPOINTS: Endpoint[] = []
if (mode !== 'dev') {
  ENDPOINTS.push({
    id: 'jfactory-mainnet',
    name: 'JFactory RPC',
    cluster: 'mainnet-beta',
    url: isDev
      ? 'https://restless-blue-valley.solana-mainnet.quiknode.pro/388d47063172de995210b42f44a3483d4269dcf9/'
      : 'https://rpc.jfactory.ch/',
    wsEndpoint: isDev ? undefined : 'wss://sleek-solemn-rain.solana-mainnet.quiknode.pro/6e7118f20a84b8d10c8f00ec8f16ab6878f00fb8/',
    getToken: isDev ? undefined : getJFRpcToken,
  })
}

if (mode === 'dev' || isDev) {
  ENDPOINTS.push({
    id: 'devnet',
    name: 'DevNet',
    cluster: 'devnet',
    url: 'https://polished-damp-dust.solana-devnet.quiknode.pro/e3fdb5a9915e3c3c47709465b4b5fa9f0153b674',
  })
}

export const DEFAULT_ENDPOINT = ENDPOINTS[0] as Endpoint

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
