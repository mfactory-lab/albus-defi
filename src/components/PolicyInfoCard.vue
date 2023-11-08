<script lang="ts" setup>
import { evaRefresh } from '@quasar/extras/eva-icons'
import { useWallet } from 'solana-wallets-vue'
import { formatDate } from '@/utils'
import { ALBUS_APP_URL } from '@/config'
import { COUNTRIES_LIST } from '@/config/countries'

const dialog = ref(false)
const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const requiredPolicyData = computed(() => userStore.requiredPolicyData)
const serviceLoading = computed(() => userStore.serviceLoading)

const { connected } = useWallet()
// const isProved = computed(() => !!userStore.certificate?.data.proof)
const certificate = computed(() => userStore.certificate)
const certificateValid = computed(() => userStore.certificateValid)
const certificateLoading = computed(() => userStore.state?.certificateLoading)

const createdAt = computed(() => {
  const date = new Date(Number(certificate.value?.data.createdAt) * 1000)
  return formatDate(date)
})

const expiredAt = computed(() => {
  const date = new Date(Number(certificate.value?.data.expiredAt) * 1000)
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
  <div class="policy-info" @click="dialog = true">
    i
  </div>
  <q-dialog v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
    <q-card class="swap-card">
      <q-card-section class="swap-card__header">
        Certificate
      </q-card-section>
      <div>
        <q-inner-loading :showing="serviceLoading" label-class="text-teal" label-style="font-size: 1.1em" />
        <q-card-section v-if="requiredPolicyData" class="swap-field__label">
          <div class="title">
            Required certificate
          </div>
          <div>Name: {{ serviceData?.name }} {{ requiredPolicyData.name }}</div>
          <div>Rules:</div>
          <div class="q-ml-xs">
            <div v-for="(r, i) in requiredPolicyData.rules" :key="i">
              {{ formatRule(r.key, r.label, r.value) }}
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="connected" class="swap-field__label">
          <q-inner-loading :showing="certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
          <div class="title q-mb-sm">
            Your certificate
          </div>

          <div v-if="!certificateValid" class="row">
            <create-certificate-btn />

            <q-btn
              :loading="certificateLoading"
              unelevated
              class="create-certificate-btn q-ml-md"
              color="primary"
              text-color="white"
              @click="userStore.getCertificates"
            >
              <span>reload</span>
              <q-icon :name="evaRefresh" size="8px" color="primary" />
            </q-btn>
          </div>
          <div v-else class="row items-center">
            <a :href="`${ALBUS_APP_URL}/holder`" class="certificate" target="_blank">
              <i-app-certificate />
            </a>
            <div class="q-ml-md">
              <div>Created: {{ createdAt }}</div>
              <div>Expired: <span v-html="expiredAt" /></div>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>
