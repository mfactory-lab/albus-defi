<script lang="ts" setup>
import { PriorityFee } from '~/features/priority-fee'

const isProd = import.meta.env.MODE === 'prod'
</script>

<template>
  <header class="app-header">
    <app-note />
    <div class="app-header__buttons">
      <cluster-selector v-if="!isProd" class="q-mr-sm" />
      <priority-fee class="q-pr-sm" />
      <connect-wallet />
    </div>

    <transaction-success-dialog />
    <policy-info-dialog />
  </header>
</template>
