<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { formatDate } from '@/utils'
import { ALBUS_APP_URL } from '@/config'

const connectionStore = useConnectionStore()
const cluster = computed(() => connectionStore.cluster)

const userStore = useUserStore()
const requiredPolicyData = computed(() => userStore.requiredPolicyData)
const serviceLoading = computed(() => userStore.serviceLoading)

const { connected } = useWallet()
// const isProved = computed(() => !!userStore.certificate?.data.proof)
const certificate = computed(() => userStore.certificate)
const certificateValid = computed(() => userStore.certificateValid)
const certificateLoading = computed(() => userStore.state.certificateLoading)

const createdAt = computed(() => {
  const date = new Date(Number(certificate.value?.data.createdAt) * 1000)
  return formatDate(date)
})

const expiredAt = computed(() => {
  const date = new Date(Number(certificate.value?.data.expiredAt) * 1000)
  return Number(certificate.value?.data.expiredAt) === 0 ? '&infin;' : formatDate(date)
})
</script>

<template>
  <q-card class="swap-card policy-card">
    <q-card-section class="swap-card__header">
      Certificate
    </q-card-section>
    <div>
      <q-inner-loading :showing="serviceLoading" label-class="text-teal" label-style="font-size: 1.1em" />
      <q-card-section v-if="requiredPolicyData" class="swap-card__body swap-field__label">
        <div class="title">
          Required certificate
        </div>
        <div>Name: {{ requiredPolicyData.name }}</div>
        <div>Rules:</div>
        <div class="q-ml-xs">
          <div v-for="(r, i) in requiredPolicyData.rules" :key="i">
            - {{ r.key }}: {{ r.label }}
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="connected" class="swap-card__body swap-field__label">
        <q-inner-loading :showing="certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
        <div class="title q-mb-md">
          Your certificate
        </div>

        <div v-if="!certificateValid" class="certificate-status__undefined">
          <q-btn
            :label="certificate ? 'prove' : 'create'"
            unelevated
            :color="certificate ? 'teal-14' : 'yellow'"
            text-color="black"
            :href="`${ALBUS_APP_URL}/wizard/${userStore.requiredPolicy}/${cluster}`"
            target="_blank"
            type="a"
          />
          <q-btn
            :loading="certificateLoading"
            class="q-ml-md"
            label="reload"
            unelevated
            color="yellow"
            text-color="black"
            @click="userStore.getCertificates"
          />
        </div>
        <div v-else class="certificate-status__proved">
          <a :href="`${ALBUS_APP_URL}/holder`" target="_blank">
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
</template>
