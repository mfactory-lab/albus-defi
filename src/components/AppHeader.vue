<script lang="ts" setup>
const route = useRoute()

const headerTitle = computed(() => `ALBUS COMPLIANCE ${String(route.name)}`)
</script>

<template>
  <header class="app-header">
    <div class="app-header__title">
      {{ headerTitle }}
    </div>

    <div class="app-header__buttons">
      <cluster-selector />
      <connect-wallet />
    </div>
  </header>
</template>
