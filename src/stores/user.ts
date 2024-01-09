import type { Buffer } from 'node:buffer'
import { defineStore } from 'pinia'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import type { AccountInfo, PublicKey, PublicKeyInitData } from '@solana/web3.js'
import debounce from 'lodash-es/debounce'
import type { ServiceProvider } from '@albus-finance/sdk'
import { AlbusClient, ProofRequest, ProofRequestStatus } from '@albus-finance/sdk'
import { getSolanaBalance, getTokensByOwner } from '@/utils'
import type { PolicyItem } from '@/config'
import { APP_CONFIG, ENVIRONMENT, SOL_MINT, WRAPPED_SOL_MINT } from '@/config'

export const useUserStore = defineStore('user', () => {
  const connectionStore = useConnectionStore()
  const wallet = useWallet()
  const anchorWallet = useAnchorWallet()
  const { publicKey } = wallet
  const route = useRoute()
  const emitter = useEmitter()

  const client = computed(() => AlbusClient.fromWallet(connectionStore.connection, anchorWallet.value).env(ENVIRONMENT).configure('debug', true))
  watch(client, () => console.log('AlbusClient: ', client.value), { immediate: true })
  const { tokens } = useToken()

  const serviceLoading = ref(false)
  const policySpec = ref('')
  // @ts-expect-error not all of clusters in config
  const appConfig = computed(() => APP_CONFIG[connectionStore.cluster])

  const pagePolicy = computed<string>(() => {
    if (route.name) {
      const pagePolicy = appConfig.value?.policy[route.name]
      if (pagePolicy) {
        return pagePolicy[policySpec.value] ?? pagePolicy.default
      }
    }
    return ''
  })
  const contractPolicy = ref<{ [key: string]: string }>({})
  const requiredPolicy = computed<string>(() => {
    if (route.name) {
      return contractPolicy.value[route.name] ?? pagePolicy.value
    }
    return ''
  })
  function setContractPolicy(policy: string, page?: string) {
    contractPolicy.value[page ?? route.name] = policy
    // TODO: better solution
    if (page === 'swap') {
      setContractPolicy(policy, 'liquidity')
    }
    console.log('[swap] policies = ', contractPolicy.value)
  }

  const certificatesSubscriptions = ref<number[]>([])

  const servicePolicy = ref<PolicyItem[]>([])
  const serviceData = ref<ServiceProvider>()
  watch([appConfig, client], debounce(async () => {
    console.log('[debug] service Code === ', appConfig.value.serviceCode)
    if (appConfig.value) {
      serviceLoading.value = true
      servicePolicy.value = await client.value?.policy.find({ serviceCode: appConfig.value.serviceCode })
      serviceData.value = (await client.value?.service.find({ code: appConfig.value.serviceCode }))?.[0]?.data ?? undefined
      serviceLoading.value = false
    } else {
      servicePolicy.value = []
      serviceData.value = undefined
    }
    console.log('[debug] serviceData  === ', serviceData.value)
    console.log('[debug] required Policy pk === ', requiredPolicy.value)
    console.log('[debug] service Policy === ', servicePolicy.value)
  }, 200), { immediate: true })
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

  const getUserTokens = debounce(async () => {
    if (!publicKey.value) {
      return
    }
    try {
      state.loading = true

      const solBalance = await getSolanaBalance(publicKey.value?.toBase58() as PublicKeyInitData, connectionStore.connection)
      const solConf = tokens.value.find(t => t.mint === SOL_MINT)
      const solToken = solConf
        ? {
            name: solConf.name,
            symbol: solConf.symbol,
            balance: solBalance,
            decimals: 9,
            mint: SOL_MINT,
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

      state.tokens = [solToken, ...tokensState].filter(t => !!t)
      console.log('[debug] user tokens === ', state.tokens)
    } finally {
      state.loading = false
    }
  }, 2000)

  const tokenBalance = (token: string) => {
    let balance = state.tokens.find(t => t.mint === token)?.balance ?? 0
    if (token === WRAPPED_SOL_MINT) {
      balance += state.tokens.find(t => t.mint === SOL_MINT)?.balance ?? 0
    }
    return balance
  }

  const reloadCertData = async (accountInfo: AccountInfo<Buffer>) => {
    try {
      const certData = ProofRequest.fromAccountInfo(accountInfo)[0]

      const idx = state.certificates?.findIndex(c => c.data?.policy.toBase58() === certData.policy.toBase58()) ?? -1

      if (state.certificates && idx > -1) {
        const cert = state.certificates[idx]
        cert.data = certData
        state.certificates = [...state.certificates.slice(0, idx), cert, ...state.certificates.slice(idx + 1)]
      }
    } catch (e) {
      console.log('reload cert error: ', e)
      // TODO: improve listener
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setTimeout(getCertificates, 0)
    }
  }

  const getCertificates = debounce(async () => {
    // TODO: improve listener
    certificatesSubscriptions.value = []
    if (!publicKey.value) {
      certificatesSubscriptions.value.forEach((s) => {
        try {
          connectionStore.connection.removeAccountChangeListener(s)
        } catch {}
      })
      certificatesSubscriptions.value = []
      return
    }
    try {
      state.certificateLoading = true
      state.certificates = await client.value?.proofRequest.find({
        user: publicKey.value,
        serviceProviderCode: appConfig.value?.serviceCode,
      })
      console.log('[debug] certificates === ', state.certificates)

      const subscriptions: number[] = []
      state.certificates.forEach((cert) => {
        subscriptions.push(
          connectionStore.connection.onAccountChange(cert.pubkey, reloadCertData),
        )
      })
      certificatesSubscriptions.value = subscriptions
    } catch (e) {
      console.error('getCertificates error:', e)
    } finally {
      state.certificateLoading = false
    }
  }, 1500)

  const certificate = computed(() => {
    if (requiredPolicy.value) {
      return state.certificates?.find((c: any) => c.data.policy.toBase58() === requiredPolicy.value)
    }
    return null
  })
  const certificateValid = computed(() => {
    console.log('========== requiredPolicy.value = ', requiredPolicy.value)
    return !requiredPolicy.value || (certificate.value && certificate.value.data?.status === ProofRequestStatus.Verified)
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
  emitter.on(ACCOUNT_CHANGE_EVENT, () => {
    getUserTokens()
    getCertificates()
  })

  return {
    state,
    certificate,
    certificateValid,

    serviceLoading,

    contractPolicy,
    setContractPolicy,
    requiredPolicy,
    requiredPolicyData,
    policySpec,
    serviceData,
    servicePolicy,

    tokenBalance,
    getUserTokens,
    getCertificates,
  }
})

export interface Certificate {
  pubkey: PublicKey
  data: ProofRequest | null
}
interface UserState {
  tokens: IUserToken[]
  loading: boolean
  certificates?: Certificate[]
  certificateLoading: boolean
}

export interface IUserToken {
  symbol: string
  name: string
  balance: number
  mint: string
  decimals: number
}
