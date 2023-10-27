<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { formatDate } from '@/utils'
import { ALBUS_APP_URL } from '@/config'

const userStore = useUserStore()

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
  <div id="certificate" class="certificate">
    <div class="certificate-text">
      Certificate:
    </div>
    <div class="certificate-status">
      <div v-if="!connected" class="certificate-not-connected">
        -
      </div>
      <div v-else-if="certificateLoading" class="certificate-loading">
        <q-inner-loading :showing="certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
      </div>
      <div v-else-if="!certificateValid" class="certificate-status__undefined">
        <q-btn
          :label="certificate ? 'prove' : 'create'"
          size="sm"
          unelevated
          :color="certificate ? 'teal-14' : 'yellow'"
          text-color="black"
          :href="`${ALBUS_APP_URL}/wizard/${userStore.requiredPolicy}`"
          target="_blank"
          type="a"
        />
      </div>
      <div v-else class="certificate-status__proved">
        <a :href="ALBUS_APP_URL" target="_blank">
          <i-app-certificate />
          <q-tooltip anchor="top middle" self="center middle">
            Your certificate has been prove. Created: {{ createdAt }}. Expired: <span v-html="expiredAt" />
          </q-tooltip>
        </a>
      </div>
    </div>

    <q-btn
      v-if="!certificateLoading && connected && !certificateValid"
      label="reload"
      size="sm"
      unelevated
      color="yellow"
      text-color="black"
      @click="userStore.getCertificates"
    />
  </div>
</template>
