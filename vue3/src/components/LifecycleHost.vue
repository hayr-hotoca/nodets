<script setup lang="ts">
import { onBeforeUpdate, onMounted, onUnmounted, onUpdated } from 'vue'
import { useLifecycleStore } from '../stores/lifecycle'

const lifecycleStore = useLifecycleStore()

onMounted(() => {
  lifecycleStore.setPhase('mounted')
})

onBeforeUpdate(() => {
  lifecycleStore.setPhase('updating')
})

onUpdated(() => {
  lifecycleStore.setPhase('updated')
})

onUnmounted(() => {
  lifecycleStore.reset()
})
</script>

<template>
  <slot />
</template>
