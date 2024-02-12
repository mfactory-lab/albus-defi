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
    <div class="app-description__details">
      The converter works exclusively in presentation mode and only on the devnet network. You can get acquainted with the
      functionality by switching Solana RPC Network.
      <q-btn :disable="isDevRPC" class="switch-network-btn" unelevated @click="handleSwitch">
        switch network
      </q-btn>
    </div>
  </div>
</template>

<style lang="scss">
.converter-description {

  .app-description__details {
    @media (max-width: 1075px) {
      text-align: center;
    }
  }

  .switch-network-btn {
    background: $primary;
    color: #fff;
    font-size: 8px;
    border-radius: 25px;
    margin-left: 10px;

    @media (max-width: $breakpoint-xs) {
      margin: 10px 0 0 10px;
    }
  }
}
</style>
