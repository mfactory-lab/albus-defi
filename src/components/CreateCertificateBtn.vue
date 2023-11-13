<script lang="ts" setup>
import { evaArrowIosForwardOutline } from '@quasar/extras/eva-icons'
import { ALBUS_APP_URL } from '@/config'

const connectionStore = useConnectionStore()
const cluster = computed(() => connectionStore.cluster)
const route = useRoute()

const userStore = useUserStore()
const certificate = computed(() => userStore.certificate)

const certificateLink = computed(() => {
  const redirect = encodeURIComponent(`${location.origin}${route.fullPath}`)
  return `${ALBUS_APP_URL}/wizard/${userStore.requiredPolicy}/${cluster.value}?redirect=${redirect}`
})
</script>

<template>
  <q-btn
    unelevated
    class="create-certificate-btn"
    :href="certificateLink"
    target="_blank"
    type="a"
  >
    <span>{{ certificate ? 'prove' : 'create' }}</span>
    <q-icon :name="evaArrowIosForwardOutline" size="8px" color="black" />
  </q-btn>
</template>
