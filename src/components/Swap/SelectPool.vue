<script setup lang="ts">
import type { SwapPool } from '@/stores/swap'

const swapStore = useSwapStore()
const tokenSwaps = computed(() => swapStore.tokenSwaps)
const { state } = swapStore

const dialog = ref(false)
function selectPool(pool: SwapPool) {
  swapStore.setTokenSwap(pool)
  dialog.value = false
}
</script>

<template>
  <div v-if="tokenSwaps.length > 1">
    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
    <div class="row items-center">
      <div class="swap-rate">
        Found {{ tokenSwaps.length }} pools for this token pair
      </div>
      <q-btn
        text-color="primary"
        class="q-ml-auto swap-card__select-pool-btn"
        size="sm"
        @click="dialog = true"
      >
        Select
      </q-btn>
    </div>

    <q-dialog v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
      <q-card class="q-pa-md">
        <div
          v-for="(pool, idx) in tokenSwaps"
          :key="pool.pubkey.toBase58()"
          class="cursor-pointer"
        >
          <pools-list-item
            :pubkey="pool.pubkey"
            :data="pool.data"
            use-emit
            :class="{ 'q-mt-md': idx }"
            @select-pool="selectPool(pool)"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
