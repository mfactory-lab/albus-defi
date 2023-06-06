<script lang="ts" setup>
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL } from '@/config/common'

const { state } = useQuasarTheme()
</script>

<template>
  <footer v-if="state.isMobile">
    <div class="container footer">
      <div class="footer-copyrights">
        © Copyright 2022 albus.finance All rights reserved.<br>
        Powered by mFactory GmbH
      </div>
      <div class="footer-social">
        <a :href="TELEGRAM_URL" target="_blank">
          <i-app-telegram />
        </a>
        <a :href="TWITTER_URL" target="_blank">
          <i-app-twitter />
        </a>
        <a :href="DISCORD_URL" target="_blank">
          <i-app-discord />
        </a>
      </div>
      <dark-theme-toggle v-if="state.isMobile" prop-class="footer-theme" />
    </div>
  </footer>
</template>
