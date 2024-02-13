<script lang="ts" setup>
</script>

<template>
  <header class="app-header">
    <app-note />
    <div class="app-header__buttons">
      <cluster-selector class="q-mr-sm" />
      <connect-wallet />
    </div>

    <transaction-success-dialog />
    <policy-info-dialog />
  </header>
</template>
