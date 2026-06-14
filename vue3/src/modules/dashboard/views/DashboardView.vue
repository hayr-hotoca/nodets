<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/useAuthStore'

const { user } = useAuthStore()
</script>

<template>
  <div class="min-h-screen p-8 bg-surface-container-lowest">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-display font-bold text-on-surface">
      Chào mừng {{ user?.name }} đến Hệ thống Quản lý
      👋
    </h1>
      <p class="text-on-surface-variant font-body-md mt-2">
        Đăng nhập thành công! Hãy chọn một module từ navigation.
    </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div class="p-6 bg-white rounded-xl border border-outline-variant shadow-sm">
          <h2 class="font-semibold text-lg">Bộ phận</h2>
          <p class="text-on-surface-variant">Quản lý các bộ phận của công ty</p>
        </div>
        <div class="p-6 bg-white rounded-xl border border-outline-variant shadow-sm">
          <h2 class="font-semibold text-lg">Phiếu Nhập Kho</h2>
          <p class="text-on-surface-variant">Tạo phiếu nhập kho vật tư</p>
        </div>
        <div class="p-6 bg-white rounded-xl border border-outline-variant shadow-sm">
          <h2 class="font-semibold text-lg">Kho hàng</h2>
          <p class="text-on-surface-variant">Quản lý các kho hàng</p>
        </div>
      </div>
    </div>
  </div>
</template>
