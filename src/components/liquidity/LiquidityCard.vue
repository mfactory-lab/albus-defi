<script setup lang="ts">
const tab = ref('deposit')
</script>

<template>
  <q-card class="liquidity-tabs swap-card swap-widget">
    <q-tabs
      v-model="tab"
      align="justify"
      indicator-color="transparent"
      :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-grey-3'"
      active-color="white"
      active-bg-color="primary"
    >
      <q-tab :ripple="false" label="Deposit" name="deposit" />
      <q-tab :ripple="false" label="Withdraw" name="withdraw" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <q-tab-panel name="deposit">
        <deposit-both-card />
      </q-tab-panel>

      <q-tab-panel name="withdraw">
        <withdraw-both-card />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>
