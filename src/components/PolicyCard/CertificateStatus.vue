<script lang="ts" setup>
import { ProofRequestStatus } from '@albus-finance/sdk'
import { formatDate } from '@/utils'
import type { Certificate } from '@/stores'

const props = defineProps({
  certificate: Object as PropType<Certificate | null>,
  certificateValid: Boolean,
})

const expiredAt = computed(() => {
  if (!props.certificate) {
    return
  }
  const date = new Date(Number(props.certificate.data?.expiredAt) * 1000)
  return Number(props.certificate?.data?.expiredAt) === 0 ? '&infin;' : formatDate(date)
})

const { certificateLink, certificateExpired } = useCertificate()
</script>

<template>
  <a :href="certificateLink" class="certificate-card__status" target="_blank">
    <div
      v-if="certificateValid"
      class="certificate-card__info__date certificate-card__info__date--positive"
    >
      valid until <span v-html="expiredAt" />
    </div>
    <div
      v-else-if="certificate?.data?.status === ProofRequestStatus.Proved"
      class="certificate-card__info__date certificate-card__info__date--warning"
    >
      <span>please wait...</span>
    </div>
    <div
      v-else
      class="certificate-card__info__date certificate-card__info__date--negative"
    >
      <span v-if="!certificate">no certificate</span>
      <span v-else-if="certificate.data?.status === ProofRequestStatus.Rejected">invalid certificate</span>
      <span v-else-if="certificateExpired">expired certificate</span>
      <span v-else>action required</span>
    </div>
  </a>
</template>
