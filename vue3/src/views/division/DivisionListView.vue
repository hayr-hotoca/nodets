<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '../../services/api'

const { data, isLoading, isError, error } = useQuery<Division[]>({
  queryKey: ['divisions'],
  queryFn: api.getDivisions,
})
</script>

<template>
  <div class="min-h-screen p-8 bg-surface-container-lowest">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-display font-semibold text-on-surface">Danh sách Bộ phận</h1>
      <router-link 
        to="/division/new" 
        class="h-10 px-4 bg-primary hover:bg-primary-dark text-on-primary font-medium rounded-full flex items-center transition-colors"
      >
        Thêm Bộ phận
      </router-link>
    </div>
    
    <div v-if="isLoading" class="bg-surface p-8 rounded-xl border border-outline-variant flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-3 text-on-surface-variant font-medium">Đang tải danh sách bộ phận...</span>
    </div>
    
    <div v-else-if="isError" class="bg-error-container p-6 rounded-xl border border-error text-center text-on-error-container">
      Có lỗi xảy ra: {{ (error as Error).message }}
    </div>
    
    <div v-else-if="!data || data.length === 0" class="bg-surface p-8 rounded-xl border border-outline-variant text-center text-on-surface-variant">
      Danh sách bộ phận đang trống.
    </div>

    <div v-else class="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-highest text-on-surface border-b border-outline-variant">
              <th class="p-4 font-semibold whitespace-nowrap">ID</th>
              <th class="p-4 font-semibold whitespace-nowrap">Mã Bộ phận</th>
              <th class="p-4 font-semibold whitespace-nowrap">Tên Bộ phận</th>
              <th class="p-4 font-semibold whitespace-nowrap">ID Đơn vị</th>
            </tr>
          </thead>
          <tbody class="text-on-surface-variant">
            <tr 
              v-for="division in data" 
              :key="division.id" 
              class="border-b border-outline-variant hover:bg-surface-container-low transition-colors"
            >
              <td class="p-4 whitespace-nowrap">{{ division.id }}</td>
              <td class="p-4 whitespace-nowrap font-medium text-primary">{{ division.code }}</td>
              <td class="p-4 whitespace-nowrap font-medium text-on-surface">{{ division.name }}</td>
              <td class="p-4 whitespace-nowrap">{{ division.unit_id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
