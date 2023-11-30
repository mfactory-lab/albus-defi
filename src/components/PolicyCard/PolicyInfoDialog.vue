<script lang="ts" setup>
import { SHOW_CERTIFICATE_EVENT } from '@/utils'

const emitter = useEmitter()
const dialog = ref(false)
emitter.on(SHOW_CERTIFICATE_EVENT, () => {
  dialog.value = true
})

const userStore = useUserStore()
const requiredPolicyData = computed(() => userStore.requiredPolicyData)

const certificateLoading = computed(() => userStore.state?.certificateLoading)
const { certificateLink, certificateValid, certificate } = useCertificate()
</script>

<template>
  <q-dialog v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
    <policy-info-view
      :required-policy-data="requiredPolicyData"
      :certificate="certificate"
      :certificate-valid="!!certificateValid"
      :certificate-loading="certificateLoading"
      :certificate-link="certificateLink"
    />
  </q-dialog>
</template>
