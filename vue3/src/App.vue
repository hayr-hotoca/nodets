<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import LifecycleHost from './components/LifecycleHost.vue'
import ModalExample from './components/ModalExample.vue'
import { useLifecycleStore, type LifecyclePhase } from './stores/lifecycle'

const lifecycleStore = useLifecycleStore()
const { phase, updateCount, lastTransitionAt } = storeToRefs(lifecycleStore)

const modalExampleRef = ref<InstanceType<typeof ModalExample> | null>(null)

const openModal = () => {
  modalExampleRef.value?.openModal()
}

const phaseLabel = computed(() => {
  const labels: Record<LifecyclePhase, string> = {
    idle: 'Chưa mount',
    mounted: 'Mounted',
    updating: 'Updating',
    updated: 'Updated',
  }
  return labels[phase.value]
})

const phaseBadgeClass = computed(() => {
  const classes: Record<LifecyclePhase, string> = {
    idle: 'bg-surface-container-high text-on-surface-variant',
    mounted: 'bg-primary/15 text-primary',
    updating: 'bg-secondary/15 text-secondary',
    updated: 'bg-green-100 text-green-800',
  }
  return classes[phase.value]
})

watch(
  phase,
  (newPhase, oldPhase) => {
    console.info(`[Lifecycle] ${oldPhase ?? 'none'} → ${newPhase}`)
  },
  { immediate: true },
)

watch(updateCount, (count) => {
  if (count > 0) {
    console.info(`[Lifecycle] Tổng lần updated: ${count}`)
  }
})
</script>

<template>
  <div>
    <nav class="bg-primary text-on-primary p-4 flex flex-wrap gap-4 items-center font-medium shadow-md">
      <router-link
        to="/division"
        class="hover:text-primary-light transition-colors"
        active-class="text-primary-light font-bold"
      >
        Danh sách Bộ phận
      </router-link>
      <router-link
        to="/division/new"
        class="hover:text-primary-light transition-colors"
        active-class="text-primary-light font-bold"
      >
        Thêm Bộ phận
      </router-link>
      <router-link
        to="/goods-received-note"
        class="hover:text-primary-light transition-colors"
        active-class="text-primary-light font-bold"
      >
        Lập Phiếu Nhập Kho
      </router-link>

      <button
        type="button"
        class="px-4 py-2 bg-primary-light hover:bg-primary-light/80 text-primary rounded-lg transition-colors"
        @click="openModal"
      >
        Open Modal
      </button>

      <span
        class="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
        :class="phaseBadgeClass"
        :title="lastTransitionAt ? `Lần cuối: ${new Date(lastTransitionAt).toLocaleTimeString('vi-VN')}` : ''"
      >
        {{ phaseLabel }} ({{ updateCount }}x updated)
      </span>
    </nav>

    <router-view v-slot="{ Component, route }">
      <LifecycleHost :key="route.fullPath">
        <component :is="Component" />
      </LifecycleHost>
    </router-view>

    <ModalExample ref="modalExampleRef" />
  </div>
</template>
