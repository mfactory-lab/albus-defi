import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'
import type { PublicKey, PublicKeyInitData } from '@solana/web3.js'
import { lowerCase } from 'lodash-es'
import { getSolanaBalance, getTokenAccounts } from '@/utils'
import { ALBUS_APP_URL } from '@/config'

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
    certificateLoading: true,
    certificate: undefined,
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
      await getCertificate()
    } catch (e) {
      console.log(e)
    }
  }

  async function getCertificate() {
    try {
      state.certificateLoading = true
      state.certificate = await clientStore.client?.findProofRequests()
    } finally {
      state.certificateLoading = false
    }
  }

  const certificate = computed(() => {
    const certificateData = state.certificate
    return certificateData?.find((r: any) => r)
  })

  async function proveRequest(e: any) {
    if (!e.ctrlKey) {
      window.open(ALBUS_APP_URL, '_blank')
      return
    }
    try {
      const vc = state.vc[0]?.mint
      const proofRequest = certificate.value.pubkey
      if (!vc) {
        notify({
          type: 'negative',
          html: true,
          message: `To continue, you need to create 
          <a href="${ALBUS_APP_URL}" target="_blank" style="color: #fff">Verifiable Credential</a>`,
        })
        return
      }
      await clientStore.proveRequest(proofRequest, vc)
      await getCertificate()
    } catch (e) {
      console.log(e)
    }
  }

  watch(connected, async (c) => {
    if (c && state.tokens.length === 0) {
      await reloadUserTokens()
      await getCertificate()
    } else {
      state.tokens = []
    }
  }, { immediate: true })
  return {
    state,
    certificate,
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
  certificate?: any
  certificateLoading: boolean
}

export interface IUserToken {
  symbol: string
  name: string
  balance: number
  mint: PublicKey | PublicKeyInitData
  decimals: number
}
