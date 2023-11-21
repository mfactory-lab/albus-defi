<script setup lang="ts">
// import { createTokenSwap } from '@/utils/create-token-swap'
const { state, createTokenSwap } = useCreateSwap()
</script>

<template>
  <q-card class="swap-card swap-widget">
    <q-card-section class="swap-card__header">
      Create Swap
    </q-card-section>

    <q-card-section class="swap-card__body">
      <q-input v-model="state.tokenA" label="Token A" />
      <q-input v-model="state.tokenB" label="Token B" />
      <q-input v-model="state.policy" label="Policy" />
      <q-input v-model="state.hostFee" label="Host fee, ‰" />
      <q-input v-model="state.tradeFee" label="Trade fee, ‰" />
      <q-input v-model="state.ownerTradeFee" label="Owner trade fee, ‰" />
      <q-input v-model="state.ownerWithdrawFee" label="Owner withdraw fee, ‰" />
      <div class="q-mt-lg row">
        <q-btn class="q-ml-auto" @click="createTokenSwap">
          Create Swap
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
