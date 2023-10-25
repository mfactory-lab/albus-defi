<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'
import { formatDate } from '@/utils'
import { ALBUS_APP_URL } from '@/config'

const userStore = useUserStore()

const { connected } = useWallet()
const isProved = computed(() => !!userStore.certificate?.data.proof)

const createdAt = computed(() => {
  const date = new Date(Number(userStore.certificate?.data.createdAt) * 1000)
  return formatDate(date)
})

const expiredAt = computed(() => {
  const date = new Date(Number(userStore.certificate?.data.expiredAt) * 1000)
  return Number(userStore.certificate?.data.expiredAt) === 0 ? '&infin;' : formatDate(date)
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
      <div v-else-if="userStore.state.certificateLoading" class="certificate-loading">
        <q-inner-loading :showing="userStore.state.certificateLoading" label-class="text-teal" label-style="font-size: 1.1em" />
      </div>
      <div v-else-if="!userStore.certificate || !isProved" class="certificate-status__undefined">
        <q-btn
          :label="userStore.certificate && !isProved ? 'prove' : 'create'"
          size="sm"
          unelevated
          :color="userStore.certificate && !isProved ? 'teal-14' : 'yellow'"
          text-color="black"
          :href="`${ALBUS_APP_URL}/wizard/policy-pubkey`"
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
  </div>
</template>
