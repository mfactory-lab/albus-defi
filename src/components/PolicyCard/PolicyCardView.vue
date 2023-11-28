<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import type { Policy } from '@albus-finance/sdk'
import { showCreateDialog } from '@/utils'

const props = defineProps({
  requiredPolicy: String,
  requiredPolicyData: Object as PropType<Policy | null>,
})

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const serviceLoading = computed(() => userStore.serviceLoading)
const certificateLoading = computed(() => userStore.state?.certificateLoading)

const { connected } = useWallet()

const { certificate, certificateLink, certificateValid } = useCertificate(props.requiredPolicy)
</script>

<template>
  <q-card flat class="certificate-card">
    <q-inner-loading :showing="serviceLoading || (connected && certificateLoading)" label-class="text-teal" label-style="font-size: 1.1em" />
    <div v-if="!serviceLoading && !requiredPolicy" class="certificate-card__info__title q-mt-md q-pt-xs text-center">
      No certificate required
    </div>
    <div v-else class="row">
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
          <certificate-status :certificate="certificate" :certificate-valid="!!certificateValid" />
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
