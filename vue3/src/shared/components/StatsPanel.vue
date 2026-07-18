<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0
})

const count = ref(props.initialCount)

const increment = () => count.value++
const decrement = () => count.value--
const doubledCount = computed(() => count.value * 2)
</script>

<template>
  <div class="p-6 bg-surface-container-low rounded-xl border border-outline-variant shadow-sm text-center">
    <!-- Scoped Slot: Passing Props to Slot (using camelCase) -->
    <slot
      name="stats-display"
      :count="count"
      :doubledCount="doubledCount"
      :increment="increment"
      :decrement="decrement"
    >
      <!-- Fallback content if slot isn't used -->
      <h3 class="text-3xl font-bold text-primary">{{ count }}</h3>
      <p class="text-on-surface-variant mt-2">Double: {{ doubledCount }}</p>
    </slot>

    <!-- Conditional Slot with v-if -->
    <slot v-if="$slots.actions" name="actions" class="mt-4"></slot>
  </div>
</template>
