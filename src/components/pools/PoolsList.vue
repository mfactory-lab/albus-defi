<script setup lang="ts">
const swapStore = useSwapStore()
const tokenSwapsAll = computed(() => swapStore.tokenSwapsAll)
const { state } = swapStore
</script>

<template>
  <div>
    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
    <div class="row justify-center">
      <pools-list-item
        v-for="(pool, idx) in tokenSwapsAll"
        :key="pool.pubkey?.toBase58() ?? idx"
        :pubkey="pool.pubkey"
        :data="pool.data"
        class="q-mx-sm q-mb-md"
      />
    </div>
  </div>
</template>
