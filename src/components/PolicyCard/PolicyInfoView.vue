<script lang="ts" setup>
import { evaClose, evaRefresh } from '@quasar/extras/eva-icons'
import { useWallet } from 'solana-wallets-vue'
import type { Policy } from '@albus-finance/sdk'
import { formatDate, formatRule } from '@/utils'
import { ALBUS_APP_URL } from '@/config'
import type { Certificate } from '@/stores'

const props = defineProps({
  requiredPolicyData: Object as PropType<Policy | null>,
  certificate: Object as PropType<Certificate | null>,
  certificateLink: String,
  certificateValid: Boolean,
  certificateLoading: Boolean,
})
defineEmits(['closeDialog'])

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
</script>

<template>
  <q-card class="policy-card">
    <q-icon
      size="20px"
      :name="evaClose"
      class="cursor-pointer absolute-right q-pa-xs"
      @click="$emit('closeDialog')"
    />
    <div>
      <q-inner-loading :showing="serviceLoading" label-class="text-teal" label-style="font-size: 1.1em" />
      <div v-if="connected" class="q-px-md q-pt-md">
        <q-inner-loading :showing="certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
        <div class="policy-card__title q-mb-xs">
          Your certificate
        </div>

        <div v-if="!certificateValid">
          <certificate-status class="q-mb-sm" :certificate="certificate" :certificate-valid="!!certificateValid" />
          <div class="row">
            <create-certificate-btn :certificate="certificate" :certificate-link="certificateLink" />

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

        <q-card v-else flat class="certificate-card row items-center q-mt-sm">
          <a :href="`${ALBUS_APP_URL}/holder`" class="certificate" target="_blank">
            <i-app-certificate />
          </a>
          <div class="certificate-card__modal-text q-ml-md">
            <div>Created: {{ createdAt }}</div>
            <div>Expired: <span v-html="expiredAt" /></div>
          </div>
        </q-card>
      </div>
      <div v-if="requiredPolicyData" class="policy-card__policy q-pa-md">
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
              <span v-if="(r.key !== 'maxAge' && r.key !== 'expectedDateTo') || r.label !== '0'">
                {{ formatRule(r.key, r.label, r.value) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>
