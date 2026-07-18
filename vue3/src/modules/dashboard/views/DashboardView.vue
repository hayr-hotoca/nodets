<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/useAuthStore'
import CardLayout from '../../../shared/components/CardLayout.vue'
import StatsPanel from '../../../shared/components/StatsPanel.vue'
import { ref } from 'vue'

const { user } = useAuthStore()
const userNotes = ref('')
</script>

<template>
  <div class="min-h-screen p-8 bg-surface-container-lowest">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-display font-bold text-on-surface mb-8">
        Chào mừng {{ user?.name }} đến Hệ thống Quản lý 👋
      </h1>

      <!-- Example 1: Named Slots (header, default, footer) in CardLayout -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-on-surface mb-4">1. Named Slots (header, default, footer)</h2>
        <CardLayout title="Thông tin hệ thống">
          <!-- Header slot override -->
          <template #header>
            <h2 class="font-headline-md text-headline-md text-primary">
              <span class="material-symbols-outlined mr-2">info</span>
              Thông tin hệ thống
            </h2>
            <p class="text-on-surface-variant text-sm">Tổng quan các module hệ thống</p>
          </template>

          <!-- Default body slot -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-3 bg-surface-container rounded-lg">
              <h3 class="font-semibold">Bộ phận</h3>
              <p class="text-on-surface-variant">Quản lý các bộ phận</p>
            </div>
            <div class="p-3 bg-surface-container rounded-lg">
              <h3 class="font-semibold">Phiếu nhập kho</h3>
              <p class="text-on-surface-variant">Tạo phiếu nhập kho</p>
            </div>
            <div class="p-3 bg-surface-container rounded-lg">
              <h3 class="font-semibold">Kho hàng</h3>
              <p class="text-on-surface-variant">Quản lý các kho</p>
            </div>
          </div>

          <!-- Footer slot (conditional v-if in component) -->
          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant text-sm">
                Cập nhật lần cuối: {{ new Date().toLocaleString('vi-VN') }}
              </span>
              <span class="text-green-600 text-sm font-semibold">Trạng thái: Online</span>
            </div>
          </template>
        </CardLayout>
      </div>

      <!-- Example 2: Scoped Slots (Passing Props to Slot) & v-if -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card 1: Using default slot content -->
        <CardLayout title="Thống kê đơn giản">
          <StatsPanel :initial-count="42"></StatsPanel>
        </CardLayout>

        <!-- Card 2: Using all scoped slot capabilities -->
        <CardLayout title="Thống kê nâng cao">
          <StatsPanel :initial-count="100">
            <!-- Scoped slot: Destructuring props (camelCase) -->
            <template #stats-display="{ count, doubledCount, increment, decrement }">
              <div class="space-y-3">
                <div class="p-4 bg-primary-container rounded-lg">
                  <p class="text-sm text-on-primary-container/70">Số lượng hiện tại</p>
                  <p class="text-4xl font-bold text-on-primary-container">{{ count }}</p>
                </div>
                <p class="text-on-surface-variant">
                  Số nhân đôi: <span class="font-semibold text-secondary">{{ doubledCount }}</span>
                </p>
                <div class="flex gap-3 justify-center">
                  <button type="button" @click="decrement" class="px-4 py-2 bg-error text-white rounded-lg">
                    <span class="material-symbols-outlined">remove</span>
                  </button>
                  <button type="button" @click="increment" class="px-4 py-2 bg-secondary text-on-secondary rounded-lg">
                    <span class="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </template>

            <!-- Conditional actions slot -->
            <template #actions>
              <p class="text-sm text-on-surface-variant">
                Dùng các nút để tăng/giảm giá trị!
              </p>
            </template>
          </StatsPanel>
        </CardLayout>
      </div>

      <!-- Example 3: v-if with named slots -->
      <div class="mt-8">
        <CardLayout title="Ghi chú người dùng">
          <input
            v-model="userNotes"
            type="text"
            placeholder="Nhập ghi chú của bạn..."
            class="w-full border border-outline-variant rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <!-- Only show this slot content if there are notes -->
          <template #footer v-if="userNotes.length > 0">
            <div class="bg-primary-container/10 p-3 rounded-lg text-on-primary-container">
              <span class="material-symbols-outlined mr-2">save</span>
              Ghi chú đã được lưu!
            </div>
          </template>
        </CardLayout>
      </div>
    </div>
  </div>
</template>
