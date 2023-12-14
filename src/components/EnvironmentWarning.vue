<script setup lang="ts">
const mode = import.meta.env.MODE
const connectionStore = useConnectionStore()
</script>

<template>
  <div v-if="mode !== 'prod'" class="text-h6 text-negative fixed-top-right q-pt-xs q-pr-sm">
    <span>Environment: {{ mode }}</span>
    <span class="q-ml-lg">Cluster: {{ connectionStore.cluster }}</span>
  </div>
</template>
