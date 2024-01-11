<script setup lang="ts">
import { useWallet } from 'solana-wallets-vue'

const { connected } = useWallet()
const onlyMyPools = ref(false)

const swapStore = useSwapStore()
const tokenSwapsAllFiltered = computed(() => swapStore.tokenSwapsAllFiltered.filter(p => !connected.value || !onlyMyPools.value || swapStore.userPoolsTokens[p.data.poolMint.toBase58()]))
const { state } = swapStore
</script>

<template>
  <div v-if="connected" class="full-width app-description row items-center justify-start q-mb-md">
    <span class="q-mr-sm">My Liquidity</span>
    <q-toggle v-model="onlyMyPools" color="secondary" dense class="app-toggle" />
  </div>
  <div>
    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
    <div class="row justify-center">
      <pools-list-item
        v-for="(pool, idx) in tokenSwapsAllFiltered"
        :key="pool.pubkey?.toBase58() ?? idx"
        :pubkey="pool.pubkey"
        :data="pool.data"
        class="q-mx-sm q-mb-md"
      />
      <div v-if="!state.loading && !tokenSwapsAllFiltered.length" class="text-h5">
        Pools not found
      </div>
    </div>
  </div>
</template>
