import { AlbusClientEnv, ProofRequestStatus } from '@albus-finance/sdk'
import { ALBUS_APP_URL, ENVIRONMENT } from '@/config'

export function useCertificate(policy?: string) {
  const connectionStore = useConnectionStore()
  const cluster = computed(() => connectionStore.cluster)
  const route = useRoute()

  const userStore = useUserStore()

  const certificate = computed(() => policy
    ? userStore.state.certificates?.find((c: any) => c.data.policy.toBase58() === policy)
    : userStore.certificate,
  )

  const requiredPolicy = computed(() => policy ?? userStore.requiredPolicy)

  const certificateValid = computed(() => {
    return !requiredPolicy.value || (certificate.value && certificate.value.data?.status === ProofRequestStatus.Verified)
  })

  const certificateLink = computed(() => {
    // TODO: remove temporary solution with albusUrl variable
    let albusUrl = ALBUS_APP_URL
    if (ENVIRONMENT !== AlbusClientEnv.PROD && cluster.value === 'mainnet-beta') {
      albusUrl = 'https://stage.app.albus.finance'
    }
    if (certificate.value) {
      return `${albusUrl}/holder?certificate=${certificate.value.pubkey?.toBase58()}`
    }
    const redirect = encodeURIComponent(`${location.origin}${route.fullPath}`)
    return `${albusUrl}/wizard/${requiredPolicy.value}?cluster=${cluster.value}&redirect=${redirect}`
  })

  return {
    certificate,
    certificateLink,
    certificateValid,
  }
}
