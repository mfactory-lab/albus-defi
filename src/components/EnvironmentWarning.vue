<script setup lang="ts">
const mode = import.meta.env.MODE
</script>

<template>
  <div v-if="mode !== 'production'" class="text-h5 text-negative fixed-top-right q-pt-xs q-pr-sm">
    Environment: {{ mode }}
  </div>
</template>
