<script setup lang="ts">
import faviconDark from '@/assets/img/favicon/favicon-dark.png'
import faviconlight from '@/assets/img/favicon/favicon-light.png'
import './assets/styles/main.scss'

const { state } = useQuasarThemeStore()

useHead({
  title: import.meta.env.VITE_APP_TITLE,
  meta: [
    { name: 'description', content: import.meta.env.VITE_APP_DESCRIPTION },
    { name: 'keywords', content: import.meta.env.VITE_APP_KEYWORDS },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => state.isDark ? faviconlight : faviconDark),
    },
  ],
})

onBeforeMount(() => {
  initWallet()
})
</script>

<template>
  <router-view />
</template>
