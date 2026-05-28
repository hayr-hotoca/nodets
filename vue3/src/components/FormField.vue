<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{{ label }}</span>
    <slot></slot>
  </div>
</template>
