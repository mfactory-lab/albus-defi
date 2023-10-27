import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'
import type { PublicKey, PublicKeyInitData } from '@solana/web3.js'
import { lowerCase } from 'lodash-es'
import { AlbusClient } from '@mfactory-lab/albus-sdk'
import { getSolanaBalance, getTokensByOwner } from '@/utils'
import { POLICY, SERVICE_CODE } from '@/config'

export enum IProofRequestStatus {
  Pending,
  Proved,
  Verified,
  Rejected,
  Empty,
}

export const useUserStore = defineStore('user', () => {
  const connectionStore = useConnectionStore()
  const wallet = useWallet()
  const { publicKey } = wallet
  const route = useRoute()

  const client = computed(() => publicKey.value ? AlbusClient.factory(connectionStore.connection, wallet as any) : null)
  const { tokens } = useToken()

  const state = reactive<UserState>({
    tokens: [],
    loading: false,
    certificateLoading: true,
    certificates: undefined,
  })

  const mints = computed(() => tokens.value.map(t => t.mint).filter(t => !!t))

  async function getTokens() {
    if (!publicKey.value) {
      return
    }
    try {
      state.loading = true

      const solBalance = await getSolanaBalance(publicKey.value?.toBase58() as PublicKeyInitData, connectionStore.connection)
      const solConf = tokens.value.find(t => t.symbol === 'sol')
      const solToken = solConf
        ? {
            name: solConf.name,
            symbol: solConf.symbol,
            balance: solBalance,
            decimals: 9,
            mint: solConf.mint?.[connectionStore.cluster],
          }
        : null

      // const tokens = await getTokenAccounts(publicKey.value?.toBase58() as PublicKeyInitData, connectionStore.connection)
      const tokensData = await getTokensByOwner(connectionStore.connection, publicKey.value, mints.value)
      const tokensState = tokensData.map((t) => {
        const mint = t.mint.toBase58()
        const token = tokens.value.find(i => i.mint === mint)
        if (token) {
          return {
            name: token.name,
            symbol: token.symbol,
            balance: t?.balance ?? 0,
            decimals: t?.decimals ?? 0,
            mint,
          }
        }
        return null
      })

      // @ts-expect-error null filtered
      state.tokens = [solToken, ...tokensState].filter(t => !!t)
      console.log('state.tokens === ', state.tokens)
    } finally {
      state.loading = false
    }
  }

  const tokenBalance = (token: string) => {
    return state.tokens.find(t => [lowerCase(t.symbol), lowerCase(t.name)].includes(lowerCase(token)))?.balance ?? 0
  }

  const reloadUserTokens = async () => {
    await getTokens()
  }

  async function getCertificates() {
    if (!publicKey.value) {
      return
    }
    try {
      state.certificateLoading = true
      state.certificates = await client.value?.proofRequest.find({
        user: publicKey.value,
        serviceProviderCode: SERVICE_CODE,
        // find by policy specified for action/token
      })
      console.log('certificates === ', state.certificates)
    } catch (e) {
      console.error('getCertificates error:', e)
    } finally {
      state.certificateLoading = false
    }
  }

  const requiredPolicy = computed(() => {
    if (route.name) {
      const pagePolicy = POLICY[route.name]
      if (pagePolicy) {
        return pagePolicy.default
      }
    }
    return ''
  })

  const certificate = computed(() => {
    if (requiredPolicy.value) {
      return state.certificates?.find((c: any) => c.data.policy.toBase58() === requiredPolicy.value)
    }
    return null
  })

  watch([client, publicKey], async () => {
    if (client.value && publicKey.value) {
      getCertificates()
    }
  }, { immediate: true })

  watch(publicKey, (p) => {
    if (p) {
      reloadUserTokens()
    } else {
      state.tokens = []
    }
  }, { immediate: true })

  return {
    state,
    certificate,
    requiredPolicy,
    getTokens,
    tokenBalance,
    reloadUserTokens,
  }
})

interface UserState {
  tokens: IUserToken[]
  loading: boolean
  certificates?: any
  certificateLoading: boolean
}

export interface IUserToken {
  symbol: string
  name: string
  balance: number
  mint: PublicKey | PublicKeyInitData
  decimals: number
}
