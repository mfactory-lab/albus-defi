<script lang="ts" setup>
import { evaBell, evaBellOutline } from '@quasar/extras/eva-icons'
import type { PublicKey } from '@solana/web3.js'
import type { ProofRequestArgs } from '@albus/sdk'
import { shortenAddress } from '@/utils'

const userStore = useUserStore()

const requests = computed(() => {
  const requestsData = userStore.state.requests?.map(({ pubkey, data }: { pubkey: PublicKey; data: ProofRequestArgs }) => {
    return {
      pubkey: pubkey.toBase58(),
      proof: data.proof,
    }
  })
  return requestsData?.filter((r: ProofRequestArgs) => !r.proof) ?? []
})

const isProvedRequest = computed(() => requests.value.length !== 0)

const notificationIcon = computed(() => isProvedRequest.value ? evaBell : evaBellOutline)
</script>

<template>
  <q-btn-dropdown
    :label="isProvedRequest && requests.length" class="notification"
    :class="{ 'notification-animation': isProvedRequest }" rounded :dropdown-icon="notificationIcon" dense
    no-icon-animation flat menu-anchor="top middle" menu-self="bottom middle"
  >
    <q-list class="notification-list">
      <q-item v-if="!isProvedRequest" disable>
        <q-item-section>
          <q-item-label>No requests</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-for="request in requests" v-else :key="request.pubkey">
        <q-item-section>
          <q-item-label>
            <div class="notification-prove">
              <span>
                {{ shortenAddress(request.pubkey, 3) }}
                <q-tooltip>
                  {{ request.pubkey }}
                </q-tooltip>
              </span>

              <q-btn
                class="notification-prove__btn" label="prove" size="sm" dense color="yellow" text-color="black"
                unelevated @click="userStore.proveRequest"
              />
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-close-popup clickable href="https://albus.finance" target="_blank" title="albus app">
        <q-item-section>
          <q-item-label class="text-center">
            ALBUS
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<style lang="scss">
.notification {
  margin-left: auto;
  margin-right: 20px;

  svg {
    fill: $secondary;
  }

  .q-focus-helper,
  .q-btn:before {
    display: none;
  }

  .q-icon {
    margin: 0 !important;
  }

  &-prove {
    cursor: context-menu;

    &__btn {
      padding: 0 6px !important;
      margin-left: 8px;
    }
  }
}

.notification-list {
  .q-item {
    min-height: 46px;

    &:not(:last-child) {
      border-bottom: 1px solid $light-gray-half;
    }

    &:last-child {
      min-height:  30px;
    }
  }
}

.notification-animation {
  padding: 0 8px !important;

  svg {
    fill: $red-5 !important;
    animation: ring 2s ease-in-out;
  }
}

@keyframes ring {

  0%,
  100% {
    transform: rotate(0deg);
  }

  5% {
    transform: rotate(-30deg);
  }

  10% {
    transform: rotate(25deg);
  }

  15% {
    transform: rotate(-25deg);
  }

  20% {
    transform: rotate(20deg);
  }

  25% {
    transform: rotate(-20deg);
  }

  30% {
    transform: rotate(15deg);
  }

  35% {
    transform: rotate(-15deg);
  }

  40% {
    transform: rotate(15deg);
  }

  45% {
    transform: rotate(0deg);
  }
}
</style>
