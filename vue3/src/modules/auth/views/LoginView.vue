<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { toast } from 'vue3-toastify'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleSubmit = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    authStore.login(username.value, 'admin')
    toast.success('Đăng nhập thành công!')
    router.push('/')
  } else {
    toast.error('Tên đăng nhập hoặc mật khẩu không chính xác.')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface px-4">
    <div class="max-w-md w-full bg-white rounded-xl paper-shadow p-6 border border-outline-variant">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-primary">Đăng nhập</h1>
        <p class="text-on-surface-variant mt-2">Hệ thống Quản lý Vimes</p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-on-surface-variant uppercase">Tên đăng nhập</span>
          <input
            v-model="username"
            class="border-outline-variant rounded-lg font-body-md p-3 focus:ring-secondary focus:border-secondary"
            placeholder="admin"
            type="text"
            required
          />
        </div>

        <div class="flex flex-col gap-1">
          <span class="text-xs font-bold text-on-surface-variant uppercase">Mật khẩu</span>
          <input
            v-model="password"
            class="border-outline-variant rounded-lg font-body-md p-3 focus:ring-secondary focus:border-secondary"
            placeholder="••••••••"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  </div>
</template>
