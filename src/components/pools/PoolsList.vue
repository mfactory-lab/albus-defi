<script setup lang="ts">
const swapStore = useSwapStore()
const tokenSwapsAll = computed(() => swapStore.tokenSwapsAll)
const { state } = swapStore
</script>

<template>
  <div>
    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
    <pools-list-item
      v-for="pool in tokenSwapsAll"
      :key="pool.pubkey.toBase58()"
      :pubkey="pool.pubkey.toBase58()"
      :data="pool.data"
      class="q-mt-md"
    />
  </div>
</template>
