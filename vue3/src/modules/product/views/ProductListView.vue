<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { api } from '../../../services/api'
import type { Product } from '../../../shared/types/api'

const { data: products = [], isLoading } = useQuery<Product[]>({
  queryKey: ['products'],
  queryFn: api.getProducts,
})
</script>

<template>
  <div class="min-h-screen p-8 bg-surface-container-lowest">
    <h1 class="text-2xl font-display font-semibold mb-6 text-on-surface">
      Danh sách Vật Tư
    </h1>

    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-3 text-on-surface-variant font-medium">Đang tải...</span>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="product in products" :key="product.id"
        class="p-4 bg-white rounded-xl border border-outline-variant shadow-sm"
      >
        <h3 class="font-semibold text-lg">{{ product.name }}</h3>
        <p class="text-on-surface-variant text-sm mt-1">{{ product.code }}</p>
        <p class="text-primary font-semibold mt-2">{{ product.calculation_unit }}</p>
      </div>
    </div>
  </div>
</template>
