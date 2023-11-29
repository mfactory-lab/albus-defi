<script lang="ts" setup>
import { evaRefresh } from '@quasar/extras/eva-icons'
import { useWallet } from 'solana-wallets-vue'
import type { Policy } from '@albus-finance/sdk'
import { formatDate } from '@/utils'
import { ALBUS_APP_URL } from '@/config'
import { COUNTRIES_LIST } from '@/config/countries'
import type { Certificate } from '@/stores'

const props = defineProps({
  requiredPolicyData: Object as PropType<Policy | null>,
  certificate: Object as PropType<Certificate | null>,
  certificateValid: Boolean,
  certificateLoading: Boolean,
})

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const serviceLoading = computed(() => userStore.serviceLoading)

const { connected } = useWallet()

const createdAt = computed(() => {
  const date = new Date(Number(props.certificate?.data?.createdAt) * 1000)
  return formatDate(date)
})

const expiredAt = computed(() => {
  const date = new Date(Number(props.certificate?.data?.expiredAt) * 1000)
  return Number(props.certificate?.data?.expiredAt) === 0 ? '&infin;' : formatDate(date)
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
    <div>
      <q-inner-loading :showing="serviceLoading" label-class="text-teal" label-style="font-size: 1.1em" />
      <div v-if="connected" class="q-pl-md q-pt-md">
        <q-inner-loading :showing="certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
        <div class="policy-card__title q-mb-xs">
          Your certificate
        </div>

        <div v-if="!certificateValid" class="q-mb-md">
          <certificate-status class="q-mb-sm" :certificate="certificate" :certificate-valid="!!certificateValid" />
          <div class="row">
            <create-certificate-btn />

            <q-btn
              :loading="certificateLoading"
              unelevated
              class="create-certificate-btn q-ml-md"
              @click="userStore.getCertificates"
            >
              <span class="q-mx-auto">reload</span>
              <q-icon :name="evaRefresh" size="8px" color="primary" />
            </q-btn>
          </div>
        </div>

        <q-card v-else flat class="certificate-card row items-center q-mt-sm q-mb-md">
          <a :href="`${ALBUS_APP_URL}/holder`" class="certificate" target="_blank">
            <i-app-certificate />
          </a>
          <div class="certificate-card__modal-text q-ml-md">
            <div>Created: {{ createdAt }}</div>
            <div>Expired: <span v-html="expiredAt" /></div>
          </div>
        </q-card>
      </div>
      <div v-if="requiredPolicyData" class="policy-card__policy q-pb-md q-pl-md">
        <div class="policy-card__policy__title">
          Required certificate
        </div>
        <div class="policy-card__policy__info">
          <div class="policy-card__policy__subtitle">
            Name: {{ serviceData?.name }} {{ requiredPolicyData.name }}
          </div>
          <div class="policy-card__policy__subtitle">
            Rules:
          </div>
          <div class="q-ml-xs">
            <div v-for="(r, i) in requiredPolicyData.rules" :key="i">
              {{ formatRule(r.key, r.label, r.value) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>
