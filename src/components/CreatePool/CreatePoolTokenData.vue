<script setup lang="ts">
import { shortenAddress } from '~/utils/web3'

defineProps({
  balance: [String, Number],
  mint: String,
})
</script>

<template>
  <div>
    <div v-if="mint">
      <div>
        balance: {{ balance }}
      </div>
      <div>
        mint: {{ shortenAddress(mint) }}
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ mint }}
        </q-tooltip>
      </div>
    </div>
    <div v-else>
      Select token
    </div>
  </div>
</template>
