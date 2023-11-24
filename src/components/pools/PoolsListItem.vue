<script setup lang="ts">
import { TokenSwap } from '@albus-finance/swap-sdk'

defineProps({
  pubkey: String,
  data: TokenSwap,
})
</script>

<template>
  <q-card class="swap-widget">
    <q-card-section class="swap-card__header">
      Pool
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div>address: {{ pubkey }}</div>
      <div>mint A: {{ data.tokenAMint.toBase58() }}</div>
      <div>mint B: {{ data.tokenBMint.toBase58() }}</div>
      <div>policy: {{ data.policy.toBase58() }}</div>
    </q-card-section>
  </q-card>
</template>
