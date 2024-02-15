<script setup lang="ts">
const storageRPC = useLocalStorage('rpc', '')
const connectionStore = useConnectionStore()

const isDevRPC = computed(() => storageRPC.value === 'devnet')

function handleSwitch() {
  if (!isDevRPC.value) {
    connectionStore.setRpc('devnet')
  }
}

onUnmounted(() => {
  const isProd = import.meta.env.MODE === 'prod'
  if (isProd && isDevRPC.value) {
    connectionStore.setRpc('jfactory-mainnet')
  }
})
</script>

<template>
  <div class="app-description converter-description">
    <q-btn :disable="isDevRPC" class="switch-network-btn" unelevated @click="handleSwitch">
      switch network
    </q-btn>
    <div class="app-description__details">
      The converter works exclusively in presentation mode and only on the <b>devnet network</b>. You can get acquainted
      with the
      functionality by switching Solana RPC Network
    </div>
  </div>
</template>

<style lang="scss">
.converter-description {
  display: flex;
  align-items: center;
  gap: 22px;

  @media (max-width: $breakpoint-sm) {
    padding-left: 0;
  }

  @media (max-width: $breakpoint-xs) {
    flex-direction: column-reverse;
  }

  .switch-network-btn {
    background: $light-gray;
    color: #000;
    border: 1px solid $light-gray-middle;
    font-size: 13px;
    font-weight: 400;
    border-radius: $btn-border;
    min-width: 148px;
    width: 148px;
    height: 40px;
  }
}
</style>
