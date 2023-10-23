<script lang="ts" setup>
import { evaBell, evaBellOutline } from '@quasar/extras/eva-icons'
import { shortenAddress } from '@/utils'
import { ALBUS_APP_URL } from '@/config'

const userStore = useUserStore()

const requests = computed(() => {
  const requestsData = userStore.certificate ? [userStore.certificate] : []
  return requestsData?.filter(r => !r.data.proof) ?? []
})

const isProvedRequest = computed(() => requests.value.length !== 0)

const notificationIcon = computed(() => isProvedRequest.value ? evaBell : evaBellOutline)
</script>

<template>
  <q-btn-dropdown
    :label="isProvedRequest ? requests.length : ''" class="notification"
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
                {{ shortenAddress(request.pubkey.toBase58(), 4) }}
                <q-tooltip>
                  {{ request.pubkey }}
                </q-tooltip>
              </span>
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-close-popup clickable :href="ALBUS_APP_URL" target="_blank" title="albus app">
        <q-item-section>
          <q-item-label class="text-center">
            ALBUS
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
