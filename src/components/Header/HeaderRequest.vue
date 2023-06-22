<script lang="ts" setup>
import { evaCheckmarkOutline } from '@quasar/extras/eva-icons'
import { useWallet } from 'solana-wallets-vue'

const userStore = useUserStore()

const { connected } = useWallet()
const isProved = computed(() => !!userStore.requests.proof)
</script>

<template>
  <div class="request">
    <div class="request-text">
      Request:
    </div>
    <div class="request-status">
      <div v-if="!connected" class="credentials-not-connected">
        -
      </div>
      <div v-else-if="userStore.state.loading" class="credentials-loading">
        <q-inner-loading
          :showing="userStore.state.loading"
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
      <div v-else-if="!userStore.requests" class="request-status__undefined">
        <q-btn label="create" size="sm" unelevated color="yellow" text-color="black" @click="userStore.createProofRequest" />
      </div>
      <div v-else-if="!isProved" class="request-status__pending">
        <q-btn label="prove" size="sm" unelevated color="teal-14" text-color="black" @click="userStore.proveRequest" />
      </div>
      <div v-else class="request-status__proved">
        Proved
        <q-icon :name="evaCheckmarkOutline" color="positive">
          <q-tooltip anchor="top middle" self="center middle">
            Your request has been proved
          </q-tooltip>
        </q-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.request {
    margin-left: 40px;
    display: flex;
    align-items: flex-end;
    gap: 10px;

    &-text {
        font-size: 18px;
    }

    &-status {
        font-size: 16px;

        &__proved {
            display: flex;
            align-items: center;
            gap: 8px;
        .q-icon {
            width: 18px;
            height: 18px;
            border: 1px solid $positive;
            border-radius: 50%;
        }
    }
    }
}
</style>
