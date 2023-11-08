<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { formatDate } from '@/utils'
import { ALBUS_APP_URL } from '@/config'
import { COUNTRIES_LIST } from '@/config/countries'

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const requiredPolicyData = computed(() => userStore.requiredPolicyData)
const serviceLoading = computed(() => userStore.serviceLoading)

const { connected } = useWallet()
// const isProved = computed(() => !!userStore.certificate?.data.proof)
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

function formatCamelCase(str: string) {
  return str.split(/(?=[A-Z])/).join(' ')
}

function formatRule(key: string, label: string, value: number[]) {
  if (key === 'selectionMode') {
    return `- Is${label === 'false' ? ' not' : ''} a resident of:`
  } else if (/countryLookup/.test(key)) {
    const items = value.filter(v => v > 0)
    if (items.length) {
      return items.reduce((acc, cur, idx) => `${acc}${idx > 0 ? ', ' : ''}${COUNTRIES_LIST[cur - 1]?.name}`, '')
    }
    return ''
  }
  return `- ${formatCamelCase(key)}: ${label}`
}
</script>

<template>
  <q-card class="policy-card">
    <q-inner-loading :showing="serviceLoading || certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
    <div class="row">
      <div class="policy-card__info">
        <div class="policy-card__info__title">
          Required certificate
        </div>
        <div class="policy-card__info__policy-name">
          <span
            class="policy-card__info__status-line"
            :class="certificateValid ? 'policy-card__info__status-line--positive' : 'policy-card__info__status-line--negative'"
          />
          <span>{{ serviceData?.name }}, {{ requiredPolicyData?.name }}</span>
        </div>
        <div class="row">
          <div
            v-if="certificateValid"
            class="policy-card__info__date policy-card__info__date--positive"
          >
            Valid until <span v-html="expiredAt" />
          </div>
          <div
            v-else
            class="policy-card__info__date policy-card__info__date--negative"
          >
            certificate invalid
          </div>
          <policy-info-card />
        </div>
      </div>
      <div class="policy-card__action">
        <div v-if="!certificateValid">
          <create-certificate-btn />
        </div>
        <a v-else :href="`${ALBUS_APP_URL}/holder`" class="policy-card__certificate certificate" target="_blank">
          <i-app-certificate />
        </a>
      </div>
    </div>
  </q-card>
</template>
