<script lang="ts" setup>
import arrowIcon from '@/assets/img/icons/arrow.png'

const { state } = useQuasarTheme()

const isMinimize = ref(false)

function handleSidebar() {
  isMinimize.value = !isMinimize.value
}
</script>

<template>
  <aside v-if="!state.isMobile" :class="{ 'sidebar-minimize': isMinimize }">
    <div class="sidebar">
      <sidebar-header />
      <sidebar-navigation />
      <sidebar-footer />
      <dark-theme-toggle prop-class="sidebar-theme" />
      <social-links />
      <sidebar-copyrights />
    </div>
    <q-btn
      padding="0" text-color="white" rounded dense :ripple="false" class="sidebar-modify-button"
      @click="handleSidebar"
    >
      <img :src="arrowIcon" alt="arrow icon">
    </q-btn>
  </aside>

  <mobile-menu v-else />
</template>
