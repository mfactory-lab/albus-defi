<script setup>
import logo from '@/assets/img/logo/albus-logo.svg'
import { ALBUS_APP_URL } from '@/config'
</script>

<template>
  <div class="sidebar-header">
    <div class="sidebar-header__logo">
      <a :href="ALBUS_APP_URL" target="_blanc">
        <img :src="logo" alt="logo">
      </a>
    </div>
    <div class="sidebar-header__details">
      <span>defi</span>
      <span>solana</span>
    </div>
  </div>
</template>
