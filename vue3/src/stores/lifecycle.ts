import { defineStore } from 'pinia'
import { ref } from 'vue'

export type LifecyclePhase = 'idle' | 'mounted' | 'updating' | 'updated'

export const useLifecycleStore = defineStore('lifecycle', () => {
  const phase = ref<LifecyclePhase>('idle')
  const lastTransitionAt = ref<number | null>(null)
  const updateCount = ref(0)

  function setPhase(nextPhase: LifecyclePhase) {
    phase.value = nextPhase
    lastTransitionAt.value = Date.now()

    if (nextPhase === 'updated') {
      updateCount.value += 1
    }
  }

  function reset() {
    phase.value = 'idle'
    lastTransitionAt.value = null
    updateCount.value = 0
  }

  return {
    phase,
    lastTransitionAt,
    updateCount,
    setPhase,
    reset,
  }
})
