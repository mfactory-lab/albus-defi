<script lang="ts" setup>
const { i18next } = useTranslation()

const order = ['en', 'de', 'ru', 'jp', 'id', 'ua']

const languages = computed(() => Object.keys(i18next.store.data).sort((a, b) => order.indexOf(a) - order.indexOf(b)))

const lang = computed(() => i18next.resolvedLanguage)

function handleLanguage(lang: string) {
  i18next.changeLanguage(lang.toLowerCase())
}

function langLabel(lang: string) {
  switch (lang) {
    case 'en': return 'English'
    case 'de': return 'Deutsch'
    case 'id': return 'Indonesia'
    case 'jp': return '日本語'
    case 'ru': return 'Русский'
    case 'ua': return 'Українська'
  }
}

watch(lang, (l) => {
  const body = document.querySelector('body')
  body?.classList.forEach((c) => {
    if (order.includes(c)) {
      body.classList.remove(String(c))
    }
  })
  body?.classList.add(String(l))
}, { immediate: true })
</script>

<template>
  <q-btn-dropdown
    transition-show="jump-down"
    transition-hide="jump-up"
    class="select-language"
    content-class="select-language__menu"
    unelevated
    :menu-offset="[36, -2]"
  >
    <template #label>
      <div class="select-language-label">
        <span>{{ lang }}</span>
      </div>
    </template>
    <q-list>
      <q-item
        v-for="opt in languages"
        :key="opt"
        v-close-popup
        clickable
        dense
        @click="handleLanguage(opt)"
      >
        <q-item-section>
          <q-item-label>{{ langLabel(opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
