<script lang="ts" setup>
import { evaArrowIosForwardOutline } from '@quasar/extras/eva-icons'
import type { Certificate } from '@/stores'

defineProps({
  certificate: Object as PropType<Certificate | null>,
  certificateLink: String,
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
    <span class="q-mx-auto">{{ certificate ? 'prove' : 'create' }}</span>
    <q-icon :name="evaArrowIosForwardOutline" size="8px" color="black" />
  </q-btn>
</template>
