import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'
import type { PublicKey, PublicKeyInitData } from '@solana/web3.js'
import { getSolanaBalance, getTokenAccounts } from '@/utils'

enum Tokens {
  NATIVE = 'SOL',
}

export const useUserStore = defineStore('user', () => {
  const state = reactive<UserState>({
    tokens: [],
    proofNfts: [],
    loading: false,
  })

  const connectionStore = useConnectionStore()

  const { publicKey, connected } = useWallet()

  async function getTokens() {
    try {
      state.loading = true
      const tokens = await getTokenAccounts(publicKey.value?.toBase58() as PublicKeyInitData, connectionStore.connection)
      const solBalance = await getSolanaBalance(publicKey.value?.toBase58() as PublicKeyInitData, connectionStore.connection)
      const solToken = {
        name: Tokens.NATIVE,
        symbol: Tokens.NATIVE,
        balance: solBalance,
      }

      state.tokens = [...tokens.filter(t => !t.mint), solToken]
      state.proofNfts = [...tokens.filter(t => t.symbol === 'ALBUS-P')]
    } finally {
      state.loading = false
    }
  }

  watch(connected, async (c) => {
    if (c && state.tokens.length === 0) {
      await getTokens()
    } else {
      state.tokens = []
    }
  }, { immediate: true })
  return {
    state,
    getTokens,
  }
})

interface UserState {
  tokens: IUserToken[]
  loading: boolean
  proofNfts: IUserToken[]
}

export interface IUserToken {
  symbol: string
  name: string
  balance: number
  mint?: PublicKey
}
