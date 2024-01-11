<script setup lang="ts">
import type { TokenData } from '@/config'
import { SOL_MINT } from '@/config'

interface TokenPairValue {
  tokenA: TokenData
  tokenB: TokenData
}
interface TokenPair {
  label: string
  value: TokenPairValue
}

const swapStore = useSwapStore()
const { state } = swapStore
const tokenSwaps = computed(() => swapStore.tokenSwapsAllFiltered)

const { handleFilterToken, tokens } = useToken()
handleFilterToken(SOL_MINT)

const pairs = computed(() => {
  const pools = tokenSwaps.value?.map(p => ({
    tokenA: p.data.tokenAMint.toBase58(),
    tokenB: p.data.tokenBMint.toBase58(),
  })).filter((p, idx, array) => {
    const sameIdx = array.findIndex(d => (d.tokenA === p.tokenA && d.tokenB === p.tokenB) || (d.tokenA === p.tokenB && d.tokenB === p.tokenA))
    return sameIdx === -1 || sameIdx === idx
  })
  return pools.map((p) => {
    const tokenA = tokens.value.find(t => t.mint === p.tokenA)
    const tokenB = tokens.value.find(t => t.mint === p.tokenB)
    return {
      value: {
        tokenA,
        tokenB,
      },
      label: `${tokenA?.symbol}/${tokenB?.symbol}`,
    }
  }).filter(p => p.value.tokenA && p.value.tokenB)
})

const selectedPair = ref<TokenPair>()

watch([() => state.from, () => state.to, pairs], ([from, to]) => {
  selectedPair.value = pairs.value.find(p =>
    (from.mint === p.value.tokenA?.mint && to.mint === p.value.tokenB?.mint)
    || (from.mint === p.value.tokenB?.mint && to.mint === p.value.tokenA?.mint),
  )
}, { immediate: true })

watch(selectedPair, () => {
  if (selectedPair.value) {
    state.from = selectedPair.value.value.tokenA
    state.to = selectedPair.value.value.tokenB
  }
}, { immediate: true })
</script>

<template>
  <q-select
    v-model="selectedPair" option-disable="inactive" popup-content-class="select-token-pair-popup transition-duration" outlined
    :options="pairs" dense :options-dense="false" class="select-token-pair" :standout="false"
  >
    <template #prepend>
      <div v-if="selectedPair" class="select-token-pair__selected-prepend q-mr-xs">
        <q-avatar>
          <q-img :src="selectedPair?.value.tokenA.image" :alt="selectedPair?.value.tokenA.symbol" />
        </q-avatar>
        <q-avatar>
          <img :src="selectedPair?.value.tokenB.image" :alt="selectedPair?.value.tokenB.symbol">
        </q-avatar>
      </div>
      <div v-else class="text-body2">
        Select a pair of tokens
      </div>
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps" class="token-select__token items-center">
        <div avatar class="row q-mr-sm q-pr-xs">
          <q-avatar>
            <img :src="scope.opt.value.tokenA.image">
          </q-avatar>
          <q-avatar>
            <img :src="scope.opt.value.tokenB.image">
          </q-avatar>
        </div>
        <div class="row items-center">
          <q-item-label>{{ scope.opt.value.tokenA.symbol }}</q-item-label>
          <span>/</span>
          <q-item-label>{{ scope.opt.value.tokenB.symbol }}</q-item-label>
        </div>
      </q-item>
    </template>
  </q-select>
</template>
