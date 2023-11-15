import { ALBUS_APP_URL } from '@/config'

export function useCertificateLink() {
  const connectionStore = useConnectionStore()
  const cluster = computed(() => connectionStore.cluster)
  const route = useRoute()

  const userStore = useUserStore()
  const certificate = computed(() => userStore.certificate)

  const certificateLink = computed(() => {
    if (certificate.value) {
      return `${ALBUS_APP_URL}/holder?certificate=${certificate.value.pubkey?.toBase58()}`
    }
    const redirect = encodeURIComponent(`${location.origin}${route.fullPath}`)
    return `${ALBUS_APP_URL}/wizard/${userStore.requiredPolicy}/${cluster.value}?redirect=${redirect}`
  })

  return {
    certificateLink,
  }
}
