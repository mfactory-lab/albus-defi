<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const router = useRouter()

const routeNames = router.options.routes
  .filter((r: RouteRecordRaw) => !['index', 'all'].includes(String(r.children![0].name)))
  .map((r: RouteRecordRaw) => String(r.children![0].name))
</script>

<template>
  <div class="main-page-nav" style="max-width: 350px">
    <router-link v-for="route in routeNames" :key="route" :to="route">
      {{ route }}
    </router-link>
  </div>
</template>

<style lang="scss">
.main-page-nav {
  margin: 0 auto;
  height: 605px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  a {
    font-size: 20px;
    text-decoration: none;
    text-transform: uppercase;
    color: $primary;
  }
}
</style>
