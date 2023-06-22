import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'
import type { PublicKey, PublicKeyInitData } from '@solana/web3.js'
import { lowerCase } from 'lodash-es'
import type { ProofRequestArgs } from '@albus/sdk'
import { getSolanaBalance, getTokenAccounts } from '@/utils'

enum Tokens {
  NATIVE = 'SOL',
}

enum VerifiableTypes {
  ALBUS_VC = 'ALBUS-VC',
  ALBUS_P = 'ALBUS-p',
}

export const useUserStore = defineStore('user', () => {
  const connectionStore = useConnectionStore()
  const clientStore = useClientStore()
  const { notify } = useQuasar()

  const state = reactive<UserState>({
    tokens: [],
    vc: undefined,
    loading: false,
    requests: undefined,
  })

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
        decimals: 9,
        mint: 'So11111111111111111111111111111111111111111',
      }

      state.tokens = [...tokens.filter(t => t.decimals > 0), solToken]
      state.vc = tokens.filter(t => t.symbol === VerifiableTypes.ALBUS_VC)
    } finally {
      state.loading = false
    }
  }

  const tokenBalance = (token: string) => {
    return state.tokens.find(t => [lowerCase(t.symbol), lowerCase(t.name)].includes(lowerCase(token)))?.balance ?? 0
  }

  const reloadUserTokens = () => {
    getTokens()
  }

  async function createProofRequest() {
    try {
      await clientStore.createProofRequest()
      state.requests = await getAllRequests()
    } catch (e) {
      console.log(e)
    }
  }

  async function getAllRequests() {
    return await clientStore.client?.findProofRequests()
  }

  const requests = computed(() => {
    const requestsData = state.requests?.map(({ pubkey, data }: { pubkey: PublicKey; data: ProofRequestArgs }) => {
      return {
        pubkey: pubkey.toBase58(),
        proof: data.proof,
      }
    })
    return requestsData?.find((r: any) => r)
  })

  async function proveRequest() {
    try {
      const vc = state.vc[0]?.mint
      const proofRequest = requests.value.pubkey
      if (!vc) {
        notify({
          type: 'negative',
          html: true,
          message: `To continue, you need to create 
          <a href="https://albus.finance" target="_blank" style="color: #fff">Verifiable Credential</a>`,
        })
        return
      }
      await clientStore.proveRequest(proofRequest, vc)
      state.requests = await getAllRequests()
    } catch (e) {
      console.log(e)
    }
  }

  watch(connected, async (c) => {
    if (c && state.tokens.length === 0) {
      await getTokens()
      state.requests = await getAllRequests()
    } else {
      state.tokens = []
    }
  }, { immediate: true })
  return {
    state,
    requests,
    getTokens,
    tokenBalance,
    reloadUserTokens,
    proveRequest,
    createProofRequest,
  }
})

interface UserState {
  tokens: IUserToken[]
  vc: any
  loading: boolean
  requests?: any
}

export interface IUserToken {
  symbol: string
  name: string
  balance: number
  mint: PublicKey | PublicKeyInitData
  decimals: number
}
