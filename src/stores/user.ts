import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'
import type { PublicKeyInitData } from '@solana/web3.js'
import { getSolanaBalance, getTokenAccounts } from '@/utils'

enum Tokens {
  NATIVE = 'SOL',
}

export const useUserStore = defineStore('user', () => {
  const state = reactive<UserState>({
    tokens: [],
  })

  const { connection } = useConnectionStore()

  const { publicKey, connected } = useWallet()

  watch(connected, async (c) => {
    if (c && state.tokens.length === 0) {
      const tokens = await getTokenAccounts(publicKey.value?.toBase58() as PublicKeyInitData, connection)
      const solBalance = await getSolanaBalance(publicKey.value?.toBase58() as PublicKeyInitData, connection)
      const solToken = {
        name: Tokens.NATIVE,
        symbol: Tokens.NATIVE,
        balance: solBalance,
      }

      state.tokens = [...tokens, solToken]
    } else {
      state.tokens = []
    }
  }, { immediate: true })
  return {
    state,
  }
})

interface UserState {
  tokens: IUserToken[]
}

export interface IUserToken {
  symbol: string
  name: string
  balance: number
}
