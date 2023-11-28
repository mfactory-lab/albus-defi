<script lang="ts" setup>
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL } from '@/config/common'
</script>

<template>
  <nav class="social-links">
    <a :href="TELEGRAM_URL" target="_blank" :title="TELEGRAM_URL">
      <i-app-telegram />
    </a>
    <a :href="TWITTER_URL" target="_blank" :title="TWITTER_URL">
      <i-app-twitter-x />
    </a>
    <a :href="DISCORD_URL" target="_blank" :title="DISCORD_URL">
      <i-app-discord />
    </a>
  </nav>
</template>
