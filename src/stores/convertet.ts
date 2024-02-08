import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import type { Connection, PublicKey } from '@solana/web3.js'
import type { ProgramAccount } from '@coral-xyz/anchor'
import axios from 'axios'
import { SmartConverterClient } from '@/sdk/src'
import { convertTokenIcon, getMetadataPDA, getTokensByOwner } from '@/utils'
import type { TokenData } from '@/config'

export const useConverterStore = defineStore('converter', () => {
  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()
  const { setContractPolicy } = useUserStore()

  const state = reactive<ConverterState>({
    from: {
      amount: undefined,
    },
    to: {
      amount: undefined,
    },
    token: undefined,
    allTokens: [],
    pairs: [],
    selectedPair: undefined,
    searchToken: '',
    converting: false,
    loading: false,
    isLock: true,
  })

  const converterClient = computed(() => {
    return SmartConverterClient.fromWallet(connectionStore.connection, anchorWallet.value)
  })

  async function getTokenMetadata(connection: Connection, address: string, tokenSymbol: string): Promise<any> {
    try {
      const metadata = await Metadata.fromAccountAddress(connection, getMetadataPDA(address))
      const uri = metadata.data?.uri
      if (uri) {
        const { data } = await axios.get(uri)
        return { ...data, image: convertTokenIcon(data?.image) }
      }
      return metadata
    } catch (err) {
      return { symbol: tokenSymbol, image: convertTokenIcon() }
    }
  }

  const tokenBalance = (token: string) => {
    const balance = state.allTokens.find(t => t.mint.toBase58() === token)?.balance ?? 0
    return balance
  }

  const getAllTokens = async () => {
    try {
      const pubkey = anchorWallet.value?.publicKey
      if (!pubkey) {
        return
      }
      state.allTokens = await getTokensByOwner(connectionStore.connection, pubkey)
    } catch (err) {
      console.log(err)
    }
  }

  watchDebounced(converterClient, async (c) => {
    try {
      state.loading = true
      const pairs = await converterClient.value.findPairs()

      if (state.pairs.length !== 0) {
        return
      }
      const preparePairs = await Promise.all(
        pairs.map(async (p) => {
          const pair = p.account
          const tokenA = pair.tokenA.toBase58()
          const tokenB = pair.tokenB.toBase58()
          const metadataTokenA = await getTokenMetadata(connectionStore.connection, tokenA, 'tokenA')
          const metadataTokenB = await getTokenMetadata(connectionStore.connection, tokenB, 'tokenB')

          const tokensMetadata = { [tokenA]: metadataTokenA, [tokenB]: metadataTokenB }
          return { ...p, tokensMetadata }
        }),
      )
      state.pairs = preparePairs
    } catch (err) {
      console.log(err)
    } finally {
      state.loading = false
    }
  }, { immediate: true, debounce: 500, maxWait: 1000 })

  watch(() => anchorWallet.value?.publicKey, async (pubkey) => {
    if (!pubkey) {
      state.allTokens = []
      state.from.balance = 0
      state.to.balance = 0
      return
    }
    await getAllTokens()
  }, { immediate: true })

  watch([() => state.token, () => state.allTokens, () => state.pairs], ([t]) => {
    const pair = state.selectedPair
    if (!pair) {
      return
    }

    const policy = pair.account?.policy

    if (policy) {
      setContractPolicy(String(policy))
    }

    for (const key in pair.tokensMetadata) {
      const token = pair.tokensMetadata[key]
      const balance = tokenBalance(String(key))
      if (key === t?.mint) {
        state.from = {
          ...token,
          balance,
          amount: undefined,
        }
      } else {
        state.to = {
          ...token,
          balance,
          amount: undefined,
        }
      }
    }
  })

  watch(() => state.isLock, () => {
    state.token = undefined
  })

  return {
    state,
    getAllTokens,
    converterClient,
  }
})

interface ProgramAccountWithMetadata extends ProgramAccount {
  tokensMetadata: { [key: string]: any }
}

export interface ConvertToken extends TokenData {
  publicKey: PublicKey
}

interface ConverterState {
  from: { [key: string]: any }
  to: { [key: string]: any }
  token?: ConvertToken
  pairs: ProgramAccountWithMetadata[]
  selectedPair?: ProgramAccountWithMetadata
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
  isLock: boolean
}
