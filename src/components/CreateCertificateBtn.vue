<script lang="ts" setup>
import { evaArrowIosForwardOutline } from '@quasar/extras/eva-icons'

const userStore = useUserStore()
const certificate = computed(() => userStore.certificate)

const { certificateLink } = useCertificateLink()
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
