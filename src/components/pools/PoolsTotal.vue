<script setup lang="ts">
import { formatBalance } from '@/utils'

const poolsStatsStore = usePoolsStatsStore()
const poolsStatsTotal = computed(() => poolsStatsStore.poolsStatsTotal)
</script>

<template>
  <div class="full-width q-pl-md">
    <q-inner-loading :showing="poolsStatsTotal.tvl === 0" class="swap-loading" color="grey" />
    <div class="row justify-start text-subtitle1 q-pl-xs">
      <span class="q-mr-md">TVL: ${{ formatBalance(poolsStatsTotal.tvl, 2) }}</span>
      <span>Volume 24h: ${{ formatBalance(poolsStatsTotal.volume24, 2) }}</span>
    </div>
  </div>
</template>
