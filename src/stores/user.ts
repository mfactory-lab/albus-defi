import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'
import type { PublicKey, PublicKeyInitData } from '@solana/web3.js'
import { lowerCase } from 'lodash-es'
import type { Policy, ServiceProvider } from '@mfactory-lab/albus-sdk'
import { AlbusClient, ProofRequestStatus } from '@mfactory-lab/albus-sdk'
import { getSolanaBalance, getTokensByOwner } from '@/utils'
import { APP_CONFIG } from '@/config'

export enum IProofRequestStatus {
  Pending,
  Proved,
  Verified,
  Rejected,
  Empty,
}

interface PolicyItem {
  pubkey: PublicKey
  data: Policy | null
}

export const useUserStore = defineStore('user', () => {
  const connectionStore = useConnectionStore()
  const wallet = useWallet()
  const { publicKey } = wallet
  const route = useRoute()

  const client = computed(() => AlbusClient.factory(connectionStore.connection))
  const { tokens } = useToken()

  const serviceLoading = ref(false)
  const policySpec = ref('')
  // @ts-expect-error not all of clusters in config
  const appConfig = computed(() => APP_CONFIG[connectionStore.cluster])
  const requiredPolicy = computed(() => {
    if (route.name) {
      const pagePolicy = appConfig.value?.policy[route.name]
      if (pagePolicy) {
        return pagePolicy[policySpec.value] ?? pagePolicy.default
      }
    }
    return ''
  })
  const servicePolicy = ref<PolicyItem[]>()
  const serviceData = ref<ServiceProvider>()
  watch(appConfig, async () => {
    console.log('[debug] service Code === ', appConfig.value.serviceCode)
    if (appConfig.value) {
      serviceLoading.value = true
      servicePolicy.value = await client.value?.policy.find({ serviceCode: appConfig.value.serviceCode })
      serviceData.value = (await client.value?.service.find({ code: appConfig.value.serviceCode }))?.[0].data ?? undefined
      serviceLoading.value = false
    } else {
      servicePolicy.value = undefined
      serviceData.value = undefined
    }
    console.log('[debug] required Policy pk === ', requiredPolicy.value)
    console.log('[debug] service Policy === ', servicePolicy.value)
  }, { immediate: true })
  const requiredPolicyData = computed(() => {
    if (requiredPolicy.value) {
      return servicePolicy.value?.find(p => p.pubkey.toBase58() === requiredPolicy.value)?.data
    }
    return null
  })

  const state = reactive<UserState>({
    tokens: [],
    loading: false,
    certificateLoading: true,
    certificates: undefined,
  })

  const mints = computed(() => tokens.value.map(t => t.mint).filter(t => !!t))

  async function getUserTokens() {
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
      console.log('[debug] user tokens === ', state.tokens)
    } finally {
      state.loading = false
    }
  }

  const tokenBalance = (token: string) => {
    return state.tokens.find(t => [lowerCase(t.symbol), lowerCase(t.name)].includes(lowerCase(token)))?.balance ?? 0
  }

  async function getCertificates() {
    if (!publicKey.value) {
      return
    }
    try {
      state.certificateLoading = true
      state.certificates = await client.value?.proofRequest.find({
        user: publicKey.value,
        serviceProviderCode: appConfig.value?.serviceCode,
        // find by policy specified for action/token
      })
      console.log('[debug] certificates === ', state.certificates)
    } catch (e) {
      console.error('getCertificates error:', e)
    } finally {
      state.certificateLoading = false
    }
  }

  const certificate = computed(() => {
    if (requiredPolicy.value) {
      return state.certificates?.find((c: any) => c.data.policy.toBase58() === requiredPolicy.value)
    }
    return null
  })
  const certificateValid = computed(() => {
    return certificate.value && certificate.value.data.status === ProofRequestStatus.Verified
  })

  watch([client, publicKey], async () => {
    if (client.value && publicKey.value) {
      getCertificates()
    } else {
      state.certificates = []
    }
  }, { immediate: true })

  watch(publicKey, (p) => {
    if (p) {
      getUserTokens()
    } else {
      state.tokens = []
    }
  }, { immediate: true })

  return {
    state,
    certificate,
    certificateValid,

    serviceLoading,
    requiredPolicy,
    requiredPolicyData,
    policySpec,
    serviceData,

    tokenBalance,
    getUserTokens,
    getCertificates,
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