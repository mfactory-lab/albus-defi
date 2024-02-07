<script setup lang="ts">
import { useWallet } from 'solana-wallets-vue'

const { connected } = useWallet()
const onlyMyPools = ref(false)

const swapStore = useSwapStore()
const tokenSwapsAllFiltered = computed(() => swapStore.tokenSwapsAllFiltered.filter(p => !connected.value || !onlyMyPools.value || swapStore.userPoolsTokens[p.data.poolMint.toBase58()]))
const userPoolsTokens = computed(() => swapStore.userPoolsTokens)
const { state } = swapStore

const poolsStatsStore = usePoolsStatsStore()
const poolDataLoading = computed(() => poolsStatsStore.poolsLoading)
const poolsStats = computed(() => poolsStatsStore.poolsStats)
</script>

<template>
  <div v-if="connected" class="full-width row items-center justify-start q-px-lg">
    <pools-total class="q-mb-md" />
    <div v-if="connected" class="q-mb-md q-ml-auto">
      <span class="q-mr-sm">My Liquidity</span>
      <q-toggle v-model="onlyMyPools" color="secondary" dense class="app-toggle" />
    </div>
  </div>
  <div class="full-width">
    <q-inner-loading :showing="state?.loading || poolDataLoading" class="swap-loading" color="grey" />
    <div class="row justify-center q-pl-lg">
      <pools-list-item
        v-for="(pool, idx) in tokenSwapsAllFiltered"
        :key="pool.pubkey.toBase58() ?? idx"
        :pubkey="pool.pubkey"
        :data="pool.data"
        :user-tokens="userPoolsTokens[pool.data.poolMint.toBase58()]"
        :pool-stats="poolsStats[pool.pubkey.toBase58()]"
        class="q-mr-lg q-mb-lg"
      />
      <div v-if="!state.loading && !tokenSwapsAllFiltered.length" class="text-h5">
        Pools not found
      </div>
    </div>
  </div>
</template>
