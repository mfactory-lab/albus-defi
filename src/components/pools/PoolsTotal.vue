<script setup lang="ts">
import { formatUsd } from '@/utils'

const poolsStatsStore = usePoolsStatsStore()
const poolsStatsTotal = computed(() => poolsStatsStore.poolsStatsTotal)
const poolsLoading = computed(() => poolsStatsStore.poolsLoading)
const txLoading = computed(() => poolsStatsStore.txLoading)
const priceLoading = computed(() => poolsStatsStore.priceLoading)
</script>

<template>
  <div>
    <q-inner-loading
      :showing="poolsStatsTotal.tvl === 0 && (poolsLoading || txLoading || priceLoading)"
      class="swap-loading"
      color="grey"
    />
    <div class="row justify-start">
      <div class="pools-total q-mr-md q-mb-md">
        <div class="pools-total__name">
          Total value locked
        </div>
        <div class="pools-total__value">
          ${{ formatUsd.format(poolsStatsTotal.tvl) }}
        </div>
      </div>
      <div class="pools-total q-mb-md">
        <div class="pools-total__name">
          Volume 24h
        </div>
        <div class="pools-total__value">
          ${{ formatUsd.format(poolsStatsTotal.volume24) }}
        </div>
      </div>
    </div>
  </div>
</template>
