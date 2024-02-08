<script setup lang="ts">
import swapIcon from '@/assets/img/icons/swap-icon.svg?raw'
import transferIcon from '@/assets/img/icons/transfer-icon.svg?raw'
import stakeIcon from '@/assets/img/icons/stake-icon.svg?raw'

const router = useRoute()

const routes = [
  {
    name: 'swap',
    icon: swapIcon,
  },
  {
    name: 'pools',
    icon: stakeIcon,
  },
  {
    name: 'liquidity',
    icon: swapIcon,
  },
  {
    name: 'transfer',
    icon: transferIcon,
  },
  {
    name: 'converter',
    icon: swapIcon,
  },
]

const currentRoute = ref('')

watch(() => router.path, (p) => {
  currentRoute.value = p.slice(1)
}, { immediate: true })
</script>

<template>
  <nav class="sidebar-navigation">
    <router-link
      v-for="route in routes" :key="route.name" :to="route.name"
      :class="{ 'active-route': currentRoute === route.name }" class="sidebar-navigation__item"
    >
      <div class="sidebar-navigation__item--icon" v-html="route.icon" />
      <!-- <img :src="route.icon" :alt="`${route.name} icon`"> -->
      <span name="route-name">{{ route.name }}</span>
    </router-link>
  </nav>
</template>
