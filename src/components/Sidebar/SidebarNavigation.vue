<script setup lang="ts">
import swapIcon from '@/assets/img/icons/swap-icon.svg'
import liquidityIcon from '@/assets/img/icons/liquidity-icon.svg'
import transferIcon from '@/assets/img/icons/transfer-icon.svg'
import poolsIcon from '@/assets/img/icons/pools-icon.svg'
import converterIcon from '@/assets/img/icons/converter-icon.svg'

const router = useRoute()

const routes = [
  {
    name: 'swap',
    icon: swapIcon,
  },
  {
    name: 'pools',
    icon: poolsIcon,
  },
  {
    name: 'liquidity',
    icon: liquidityIcon,
  },
  {
    name: 'transfer',
    icon: transferIcon,
  },
  {
    name: 'converter',
    icon: converterIcon,
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
      <!-- <div class="sidebar-navigation__item--icon" v-html="route.icon" /> -->
      <img class="sidebar-navigation__item--icon" :src="route.icon" :alt="`${route.name} icon`">
      <span name="route-name">{{ route.name }}</span>
    </router-link>
  </nav>
</template>
