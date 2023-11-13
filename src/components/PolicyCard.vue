<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { formatDate, showCreateDialog } from '@/utils'
import { ALBUS_APP_URL } from '@/config'

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const requiredPolicyData = computed(() => userStore.requiredPolicyData)
const serviceLoading = computed(() => userStore.serviceLoading)

const { connected } = useWallet()
const certificate = computed(() => userStore.certificate)
const certificateValid = computed(() => userStore.certificateValid)
const certificateLoading = computed(() => userStore.state?.certificateLoading)

const expiredAt = computed(() => {
  if (!certificate.value) {
    return
  }
  const date = new Date(Number(certificate.value.data.expiredAt) * 1000)
  return Number(certificate.value?.data.expiredAt) === 0 ? '&infin;' : formatDate(date)
})
</script>

<template>
  <q-card flat class="certificate-card">
    <q-inner-loading :showing="serviceLoading || certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
    <div class="row">
      <div class="certificate-card__info">
        <div class="certificate-card__info__title">
          Required certificate
        </div>
        <div class="certificate-card__info__policy-name">
          <span
            v-if="connected"
            class="certificate-card__info__status-line"
            :class="certificateValid ? 'certificate-card__info__status-line--positive' : 'certificate-card__info__status-line--negative'"
          />
          <span>{{ serviceData?.name }} {{ serviceData?.name && requiredPolicyData?.name && ',' }} {{ requiredPolicyData?.name }}</span>
        </div>
        <div v-if="connected" class="row">
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
            certificate invalid
          </div>
          <div class="policy-info" @click="showCreateDialog">
            i
          </div>
        </div>
      </div>
      <div v-if="connected" class="certificate-card__action">
        <div v-if="!certificateValid">
          <create-certificate-btn />
        </div>
        <a v-else :href="`${ALBUS_APP_URL}/holder`" class="certificate-card__certificate certificate" target="_blank">
          <i-app-certificate />
        </a>
      </div>
    </div>
  </q-card>
</template>
