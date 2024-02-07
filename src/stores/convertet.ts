import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { ProgramAccount } from '@coral-xyz/anchor'
import axios from 'axios'
import { SmartConverterClient } from '@/sdk/src'
import { getMetadataPDA, getTokensByOwner } from '@/utils'

export const useConverterStore = defineStore('converter', () => {
  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()

  const state = reactive<ConverterState>({
    from: {
      amount: 0,
    },
    to: {
      amount: 0,
    },
    token: undefined,
    allTokens: [],
    pairs: [],
    searchToken: '',
    converting: false,
    loading: false,
  })

  const converterClient = computed(() => {
    return SmartConverterClient.fromWallet(connectionStore.connection, anchorWallet.value)
  })

  async function getMetadata(connection: Connection, address: string): Promise<any> {
    try {
      const metadata = await Metadata.fromAccountAddress(connection, getMetadataPDA(address))
      const uri = metadata.data?.uri
      if (uri) {
        const { data } = await axios.get(uri)
        return data
      }
      return metadata
    } catch (err) {
      return undefined
    }
  }

  const tokenBalance = (token: string) => {
    const balance = state.allTokens.find(t => t.mint.toBase58() === token)?.balance ?? 0
    return balance
  }

  watchDebounced(converterClient, async (c) => {
    const pairs = await converterClient.value.findPairs()

    if (state.pairs.length !== 0) {
      return
    }
    const preparePairs = await Promise.all(
      pairs.map(async (p) => {
        const pair = p.account
        const tokenA = pair.tokenA.toBase58()
        const tokenB = pair.tokenB.toBase58()
        const metadataTokenA = await getMetadata(connectionStore.connection, tokenA) ?? { symbol: 'tokenA' }
        const metadataTokenB = await getMetadata(connectionStore.connection, tokenB) ?? { symbol: 'tokenB' }

        const tokensMetadata = { [tokenA]: metadataTokenA, [tokenB]: metadataTokenB }
        return { ...p, tokensMetadata }
      }),
    )
    state.pairs = preparePairs
  }, { immediate: true, debounce: 500, maxWait: 1000 })

  watch(() => anchorWallet.value?.publicKey, async (pubkey) => {
    if (!pubkey) {
      state.allTokens = []
      state.from.balance = 0
      state.to.balance = 0
      return
    }
    state.allTokens = await getTokensByOwner(connectionStore.connection, pubkey)
  }, { immediate: true })

  watch([() => state.token, () => state.allTokens, () => state.pairs], ([t]) => {
    const pair = state.pairs.find(p => p.publicKey.toBase58() === t?.publicKey?.toBase58())
    if (!pair) {
      return
    }

    for (const key in pair.tokensMetadata) {
      const token = pair.tokensMetadata[key]
      const balance = tokenBalance(t.mint)
      if (key === t.mint) {
        state.from = {
          ...state.from,
          ...token,
          balance,
        }
      } else {
        state.to = {
          ...state.to,
          ...token,
          balance,
        }
      }
    }
  })

  return {
    state,
  }
})

interface ProgramAccountWithMetadata extends ProgramAccount {
  tokensMetadata: { [key: string]: any }
}

interface ConverterState {
  from: { [key: string]: any }
  to: { [key: string]: any }
  token: any
  pairs: ProgramAccountWithMetadata[]
  converting: boolean
  loading: boolean
  allTokens: {
    address: PublicKey
    mint: PublicKey
    amount: string
    balance: number
    decimals: number
  }[]
  searchToken: string
}
