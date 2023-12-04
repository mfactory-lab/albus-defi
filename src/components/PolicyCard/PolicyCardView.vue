<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import type { Policy } from '@albus-finance/sdk'

const props = defineProps({
  requiredPolicy: String,
  requiredPolicyData: Object as PropType<Policy | null>,
})

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const serviceLoading = computed(() => userStore.serviceLoading)
const certificateLoading = computed(() => userStore.state?.certificateLoading)

const dialog = ref(false)

const { connected } = useWallet()

const { certificate, certificateLink, certificateValid } = useCertificate(props.requiredPolicy)
</script>

<template>
  <q-card flat class="certificate-card">
    <q-inner-loading :showing="serviceLoading || (connected && certificateLoading)" label-class="text-teal" label-style="font-size: 1.1em" />
    <div v-if="!serviceLoading && !requiredPolicy" class="certificate-card__info__title q-mt-sm text-center">
      No certificate required
    </div>
    <div v-else class="row nowrap full-height">
      <div class="certificate-card__info row">
        <div class="policy-info q-mr-sm" @click="dialog = true">
          i
        </div>
        <div class="certificate-card__info__status column row justify-between">
          <div class="certificate-card__info__title">
            Required certificate
          </div>

          <div v-if="connected && !serviceLoading && !certificateLoading" class="row">
            <certificate-status :certificate="certificate" :certificate-valid="!!certificateValid" />
          </div>
        </div>
        <div class="certificate-card__policy-name full-height">
          <span
            v-if="connected"
            class="certificate-card__info__status-line"
            :class="certificateValid ? 'certificate-card__info__status-line--positive' : 'certificate-card__info__status-line--negative'"
          />
          <span>{{ serviceData?.name }} {{ serviceData?.name && requiredPolicyData?.name && ',' }} {{ requiredPolicyData?.name }}</span>
        </div>
      </div>
      <div v-if="connected && !serviceLoading && !certificateLoading" class="certificate-card__end">
        <div v-if="!certificateValid" class="certificate-card__action">
          <create-certificate-btn :certificate="certificate" :certificate-link="certificateLink" />
        </div>
        <a v-else :href="certificateLink" class="certificate-card__certificate certificate" target="_blank">
          <i-app-certificate />
        </a>
      </div>
    </div>
    <q-dialog v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
      <policy-info-view
        :required-policy-data="requiredPolicyData"
        :certificate="certificate"
        :certificate-valid="!!certificateValid"
        :certificate-loading="certificateLoading"
        :certificate-link="certificateLink"
      />
    </q-dialog>
  </q-card>
</template>
