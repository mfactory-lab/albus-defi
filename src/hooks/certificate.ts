import { AlbusClientEnv, ProofRequestStatus } from '@albus-finance/sdk'
import { useWallet } from 'solana-wallets-vue'
import { ALBUS_APP_URL, ENVIRONMENT } from '@/config'

export function useCertificate(policy?: string) {
  const connectionStore = useConnectionStore()
  const cluster = computed(() => connectionStore.cluster)
  const route = useRoute()

  const wallet = useWallet()

  const userStore = useUserStore()

  const certificate = computed(() => policy
    ? userStore.state.certificates?.find((c: any) => c.data.policy.toBase58() === policy)
    : userStore.certificate,
  )

  const requiredPolicy = computed(() => policy ?? userStore.requiredPolicy)

  const certificateExpired = computed(() => certificate.value?.data?.expiredAt
    ? Number(certificate.value?.data?.expiredAt) * 1000 < Date.now()
    : false)

  const certificateValid = computed(() => {
    return !requiredPolicy.value || (certificate.value && (certificate.value.data?.status === ProofRequestStatus.Verified)
    && !certificateExpired.value)
  })

  const certificateLink = computed(() => {
    const pubkey = wallet.publicKey.value?.toBase58()
    // TODO: remove temporary solution with albusUrl variable
    let albusUrl = ALBUS_APP_URL
    if (ENVIRONMENT !== AlbusClientEnv.PROD && cluster.value === 'mainnet-beta') {
      albusUrl = 'https://stage.app.albus.finance'
    }
    if (certificate.value && certificate.value.data?.status !== ProofRequestStatus.Rejected && !certificateExpired.value) {
      return `${albusUrl}/holder?certificate=${certificate.value.pubkey?.toBase58()}&cluster=${cluster.value}${pubkey ? `&pubkey=${pubkey}` : ''}`
    }
    const redirect = encodeURIComponent(`${location.origin}${route.fullPath}`)
    return `${albusUrl}/wizard/${requiredPolicy.value}?cluster=${cluster.value}&redirect=${redirect}${pubkey ? `&pubkey=${pubkey}` : ''}`
  })

  return {
    certificate,
    certificateLink,
    certificateValid,
    certificateExpired,
  }
}
