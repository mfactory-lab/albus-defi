<script lang="ts" setup>
const isProd = import.meta.env.MODE === 'prod'
</script>

<template>
  <header class="app-header">
    <app-note />
    <div class="app-header__buttons">
      <cluster-selector v-if="!isProd" class="q-mr-sm" />
      <connect-wallet />
    </div>

    <transaction-success-dialog />
    <policy-info-dialog />
  </header>
</template>
