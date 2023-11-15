<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { showCreateDialog } from '@/utils'

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const requiredPolicyData = computed(() => userStore.requiredPolicyData)
const serviceLoading = computed(() => userStore.serviceLoading)

const { connected } = useWallet()
const certificateValid = computed(() => userStore.certificateValid)
const certificateLoading = computed(() => userStore.state?.certificateLoading)

const { certificateLink } = useCertificateLink()
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
        <div v-if="connected && !serviceLoading && !certificateLoading" class="row">
          <certificate-status />
          <div class="policy-info" @click="showCreateDialog">
            i
          </div>
        </div>
      </div>
      <div v-if="connected && !serviceLoading && !certificateLoading" class="certificate-card__action">
        <div v-if="!certificateValid">
          <create-certificate-btn />
        </div>
        <a v-else :href="certificateLink" class="certificate-card__certificate certificate" target="_blank">
          <i-app-certificate />
        </a>
      </div>
    </div>
  </q-card>
</template>
