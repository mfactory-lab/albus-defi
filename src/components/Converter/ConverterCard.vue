<script setup lang="ts">
const tab = ref('lock')
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
      <q-tab :ripple="false" label="LOCK" name="lock" />
      <q-tab :ripple="false" label="UNLOCK" name="unlock" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <q-tab-panel name="lock">
        <lock-card />
      </q-tab-panel>

      <q-tab-panel name="unlock">
        <unlock-card />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>
