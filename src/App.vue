<script setup lang="ts">
import faviconDark from '@/assets/img/favicon/favicon-dark.png'
import faviconlight from '@/assets/img/favicon/favicon-light.png'
import './assets/styles/main.scss'

const { state } = useQuasarThemeStore()
const storageRPC = useLocalStorage('rpc', '')
const connectionStore = useConnectionStore()

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

const auth = useAuthStore()
const isPasswordProtected = computed(() => auth.isEnabled && !auth.isAuthenticated)

const route = useRoute()
const router = useRouter()
watch(route, () => {
  const isDev = import.meta.env.MODE === 'development'
  const isDevRPC = storageRPC.value === 'devnet'
  if (!isDev && isDevRPC) {
    connectionStore.setRpc('jfactory-mainnet')
  }
  if (route.name === 'index' || route.name === 'all' || (route.name && !router.hasRoute(route.name))) {
    router.push('/swap')
  }
}, { immediate: true })
</script>

<template>
  <password-protect v-if="isPasswordProtected" />
  <router-view v-else />
</template>
