import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { PASSWORD_PROTECT } from '@/config'

export const useAuthStore = defineStore('auth', () => {
  const password = useLocalStorage<string>('password', null)
  const isAuthenticated = computed(() => password.value === String(PASSWORD_PROTECT))
  const isEnabled = computed(() => PASSWORD_PROTECT && String(PASSWORD_PROTECT).length > 0)

  return {
    isEnabled,
    isAuthenticated,
    password,
    login: (pass: string) => {
      password.value = pass
      return isAuthenticated.value
    },
  }
})
