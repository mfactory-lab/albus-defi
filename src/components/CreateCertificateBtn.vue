<script lang="ts" setup>
import { ALBUS_APP_URL } from '@/config'

const connectionStore = useConnectionStore()
const cluster = computed(() => connectionStore.cluster)

const userStore = useUserStore()
const certificate = computed(() => userStore.certificate)
</script>

<template>
  <q-btn
    :label="certificate ? 'prove' : 'create'"
    unelevated
    :color="certificate ? 'teal-14' : 'yellow'"
    text-color="black"
    :href="`${ALBUS_APP_URL}/wizard/${userStore.requiredPolicy}/${cluster}`"
    target="_blank"
    type="a"
  />
</template>
