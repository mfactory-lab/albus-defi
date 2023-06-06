<script lang="ts" setup>
defineProps({
  propClass: String,
})
const { state, toggle } = useQuasarTheme()
</script>

<template>
  <div :class="propClass">
    <span>Dark Mode</span>
    <q-toggle v-model="state.isDark" dense dark @click="toggle" />
  </div>
</template>
