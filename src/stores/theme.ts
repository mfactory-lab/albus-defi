import { defineStore } from 'pinia'

export const useQuasarTheme = defineStore('theme', () => {
  const q = useQuasar()

  const state = reactive({
    isMobile: false,
    isDark: false,
  })

  const theme = useLocalStorage('theme', '')

  watch(() => q.dark.mode, (d) => {
    theme.value = String(d)
    state.isDark = !!d
  })

  watch(() => q.screen.xs, (s) => {
    state.isMobile = s
  }, { immediate: true })

  onBeforeMount(() => {
    if (theme.value) {
      q.dark.set(JSON.parse(theme.value))
    }
  })
  return {
    state,
    toggle() {
      q.dark.toggle()
    },
  }
})
