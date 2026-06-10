<script setup lang="ts">
defineProps<{
  total: number
  totalInWords: string
  sourceDocs: number
}>()

const emit = defineEmits<{
  (e: 'update:sourceDocs', value: number): void
}>()
</script>

<template>
  <section class="bg-surface-container text-on-surface-variant rounded-xl p-stack-md flex flex-col gap-3 border border-outline-variant">
    <div class="flex justify-between items-center">
      <span class="font-title-sm uppercase text-primary font-semibold">Thành tiền</span>
      <div class="text-right">
        <span class="text-xl font-bold text-secondary">
          {{ total.toLocaleString('vi-VN') }} VNĐ
        </span>
      </div>
    </div>
    <div class="bg-white p-2 rounded text-[12px] italic border border-outline-variant">
      <span class="text-on-surface-variant/80 font-bold">Bằng chữ: </span>
      <span class="text-primary">{{ totalInWords || 'Không đồng.' }}</span>
    </div>
    <div class="flex flex-col gap-1 mt-2">
      <label for="source-docs" class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
        SỐ CHỨNG TỪ GỐC KÈM THEO
        <input
          id="source-docs"
          :value="sourceDocs"
          @input="emit('update:sourceDocs', parseInt(($event.target as HTMLInputElement).value, 10) || 0)"
          class="border border-outline-variant rounded p-1 w-20 focus:ring-1 focus:ring-secondary mt-1 block"
          type="number"
        />
      </label>
    </div>
  </section>
</template>
