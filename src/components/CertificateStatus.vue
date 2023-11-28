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

const { certificateLink } = useCertificate()
</script>

<template>
  <a :href="certificateLink" class="certificate-card__status" target="_blank">
    <div
      v-if="certificateValid"
      class="certificate-card__info__date certificate-card__info__date--positive"
    >
      Valid until <span v-html="expiredAt" />
    </div>
    <div
      v-else
      class="certificate-card__info__date certificate-card__info__date--negative"
    >
      <span v-if="!certificate">No certificate</span>
      <span v-else-if="certificate.data?.status === ProofRequestStatus.Rejected">Invalid certificate</span>
      <span v-else>Action required</span>
    </div>
  </a>
</template>
