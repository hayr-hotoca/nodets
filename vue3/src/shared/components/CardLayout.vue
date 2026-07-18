<script setup lang="ts">
interface Props {
  title?: string
  variant?: 'default' | 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  title: '',
  variant: 'default'
})
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-outline-variant shadow-sm">
    <!-- Named Slot: Header -->
    <div v-if="$slots.header || title" class="mb-4 pb-4 border-b border-outline-variant">
      <slot name="header">
        <h2 v-if="title" class="font-title-sm text-title-sm text-on-surface">{{ title }}</h2>
      </slot>
    </div>

    <!-- Default Slot: Body -->
    <div class="space-y-4">
      <slot></slot>
    </div>

    <!-- Named Slot: Footer (Conditional with v-if) -->
    <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-outline-variant">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
