import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) as User : null
  })

  const isAuthenticated = computed(() => !!user.value)

  function login(name: string, role: string) {
    user.value = { name, role }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, isAuthenticated, login, logout }
})
