<script lang="ts" setup>
import { evaArrowIosForwardOutline } from '@quasar/extras/eva-icons'
import { ALBUS_APP_URL } from '@/config'

const connectionStore = useConnectionStore()
const cluster = computed(() => connectionStore.cluster)

const userStore = useUserStore()
const certificate = computed(() => userStore.certificate)
</script>

<template>
  <q-btn
    unelevated
    class="create-certificate-btn"
    :href="`${ALBUS_APP_URL}/wizard/${userStore.requiredPolicy}/${cluster}`"
    target="_blank"
    type="a"
  >
    <span>{{ certificate ? 'prove' : 'create' }}</span>
    <q-icon :name="evaArrowIosForwardOutline" size="8px" color="black" />
  </q-btn>
</template>
