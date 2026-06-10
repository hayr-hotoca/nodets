<script setup lang="ts">
defineProps<{
  preparer: string
  deliverer: string
  storekeeper: string
  accountant: string
}>()

const emit = defineEmits<{
  (e: 'update:preparer', value: string): void
  (e: 'update:deliverer', value: string): void
  (e: 'update:storekeeper', value: string): void
  (e: 'update:accountant', value: string): void
}>()
</script>

<template>
  <section class="grid grid-cols-2 gap-stack-md py-4">
    <div class="flex flex-col items-center text-center gap-2">
      <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">NGƯỜI LẬP PHIẾU</span>
      <input
        :value="preparer"
        @input="emit('update:preparer', ($event.target as HTMLInputElement).value)"
        class="border border-outline-variant rounded-lg text-sm p-1 w-full text-center focus:ring-1 focus:ring-secondary"
        placeholder="Họ tên..."
      />
    </div>
    <div class="flex flex-col items-center text-center gap-2">
      <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">NGƯỜI GIAO HÀNG</span>
      <input
        disabled
        :value="deliverer"
        @input="emit('update:deliverer', ($event.target as HTMLInputElement).value)"
        class="border border-outline-variant bg-surface-container-high rounded-lg text-sm p-1 w-full text-center focus:ring-1 focus:ring-secondary"
        placeholder="Họ tên..."
      />
    </div>
    <div class="flex flex-col items-center text-center gap-2">
      <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">THỦ KHO</span>
      <input
        :value="storekeeper"
        @input="emit('update:storekeeper', ($event.target as HTMLInputElement).value)"
        class="border border-outline-variant rounded-lg text-sm p-1 w-full text-center focus:ring-1 focus:ring-secondary"
        placeholder="Họ tên..."
      />
    </div>
    <div class="flex flex-col items-center text-center gap-2">
      <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">KẾ TOÁN TRƯỞNG</span>
      <input
        :value="accountant"
        @input="emit('update:accountant', ($event.target as HTMLInputElement).value)"
        class="border border-outline-variant rounded-lg text-sm p-1 w-full text-center focus:ring-1 focus:ring-secondary"
        placeholder="Họ tên..."
      />
    </div>
  </section>
</template>
