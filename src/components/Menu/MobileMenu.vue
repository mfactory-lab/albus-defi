<script setup lang="ts">
import { evaClose, evaMenu } from '@quasar/extras/eva-icons'

const _route = useRoute()

const routes = ['swap', 'transfer', 'about', 'support']

const isOpen = ref(false)

const menuIcon = computed(() => isOpen.value ? evaClose : evaMenu)

function handleShow() {
  isOpen.value = !isOpen.value
}

watch(isOpen, (o) => {
  if (o) {
    window.addEventListener('scroll', handleShow)
  } else {
    window.removeEventListener('scroll', handleShow)
  }
})
</script>

<template>
  <div class="menu">
    <q-btn flat :ripple="false" :icon="menuIcon">
      <q-menu
        :model-value="isOpen" transition-show="jump-down" transition-hide="jump-up" anchor="center middle"
        self="center middle" style="min-width: 100vw" class="menu-container" @update:model-value="handleShow"
      >
        <q-list>
          <q-item v-for="route in routes" :key="route" clickable>
            <q-item-section>
              <router-link :to="route" :class="{ 'active-route': _route.name === route }">
                {{ route }}
              </router-link>
            </q-item-section>
          </q-item>
          <q-item clickable>
            <social-links />
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<style lang="scss">
.menu-container {
  padding: 10px 0 0;

  a {
    text-transform: uppercase;
    text-decoration: none;
    color: $primary;
    display: flex;
  }

  .active-route {
    font-weight: 600;
  }

  .q-item__section {
    justify-content: center;
    align-items: center;
  }

  .q-item:nth-child(3),
  .q-item:nth-child(5) {
    border-bottom: 1px solid rgba(78, 76, 76, 0.56);
  }

  .social-links {
    margin: 12px auto;
    display: flex;
    gap: 10px;
  }
}

.menu {
  position: absolute;

  .q-btn {
    width: 50px;
    height: 50px;
    z-index: 10000;
  }

  @media (max-width: $breakpoint-xs) {
    position: absolute;
    right: 8px;
    top: 2px;
  }
}
</style>
