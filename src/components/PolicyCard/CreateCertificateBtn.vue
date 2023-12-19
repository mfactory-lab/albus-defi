<script lang="ts" setup>
import { evaArrowIosForwardOutline, evaClockOutline } from '@quasar/extras/eva-icons'
import { ProofRequestStatus } from '@albus-finance/sdk'
import type { Certificate } from '@/stores'

defineProps({
  certificate: Object as PropType<Certificate | null>,
  certificateLink: String,
})
</script>

<template>
  <a
    v-if="certificate?.data?.status === ProofRequestStatus.Proved"
    class="cursor-pointer"
    :href="certificateLink"
    target="_blank"
  >
    <q-icon :name="evaClockOutline" size="26px" color="warning" />
  </a>
  <q-btn
    v-else
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
