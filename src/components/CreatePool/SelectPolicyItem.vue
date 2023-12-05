<script lang="ts" setup>
import type { PublicKey } from '@metaplex-foundation/js'
import type { Policy } from '@albus-finance/sdk'
import { formatRule } from '@/utils'

defineProps({
  policyData: Object as PropType<Policy>,
  policy: Object as PropType<PublicKey>,
})

const userStore = useUserStore()
const serviceData = computed(() => userStore.serviceData)
const serviceLoading = computed(() => userStore.serviceLoading)
</script>

<template>
  <q-card class="">
    <div v-if="!serviceLoading" class="policy-card__policy q-pa-md">
      <div class="policy-card__policy__info">
        <div class="policy-card__policy__subtitle">
          Address: {{ policy?.toBase58() }}
        </div>
        <div class="policy-card__policy__subtitle">
          Name: {{ serviceData?.name }} {{ policyData?.name }}
        </div>
        <div class="policy-card__policy__subtitle">
          Rules:
        </div>
        <div class="q-ml-xs">
          <div v-for="(r, i) in policyData?.rules" :key="i">
            <span v-if="(r.key !== 'maxAge' && r.key !== 'expectedDateTo') || r.label !== '0'">{{ formatRule(r.key, r.label, r.value) }}</span>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>
