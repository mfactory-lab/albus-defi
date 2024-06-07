<script lang="ts" setup>
import { colors } from 'quasar'
import { evaArrowIosForwardOutline } from '@quasar/extras/eva-icons'
import { ProofRequestStatus } from '@albus-finance/sdk'
import type { Certificate } from '@/stores'

defineProps({
  certificate: Object as PropType<Certificate | null>,
  certificateLink: String,
})

const { certificateExpired } = useCertificate()

const { getPaletteColor } = colors
</script>

<template>
  <a
    v-if="certificate?.data?.status === ProofRequestStatus.Proved"
    class="cursor-pointer"
    :href="certificateLink"
    target="_blank"
  >
    <clock-spinner :fill="getPaletteColor('warning')" size="26px" color="warning" />
  </a>
  <q-btn
    v-else
    unelevated
    class="create-certificate-btn"
    :href="certificateLink"
    target="_blank"
    type="a"
  >
    <span class="q-mx-auto">{{ certificate && !certificateExpired ? 'prove' : 'create' }}</span>
    <q-icon :name="evaArrowIosForwardOutline" size="8px" color="black" />
  </q-btn>
</template>
