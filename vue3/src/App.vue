<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import LifecycleHost from './shared/components/LifecycleHost.vue'
import ModalExample from './shared/components/ModalExample.vue'
import { useLifecycleStore, type LifecyclePhase } from './shared/stores/lifecycle'
import { useAuthStore } from './modules/auth/stores/useAuthStore'
import { useRouter, useRoute } from 'vue-router'

const lifecycleStore = useLifecycleStore()
const authStore = useAuthStore()
const { phase, updateCount, lastTransitionAt } = storeToRefs(lifecycleStore)
const router = useRouter()
const route = useRoute()

const modalExampleRef = ref<InstanceType<typeof ModalExample> | null>(null)

const openModal = () => {
  modalExampleRef.value?.openModal()
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Filter routes for navigation
const navigationRoutes = computed(() => {
  return router.getRoutes().filter(
    r => 
      !r.path.includes('*') && 
      r.path !== '/' && 
      r.path !== '/login' && 
      !r.path.includes('/new') && 
      r.meta?.requiresAuth
  )
})

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
    <nav v-if="authStore.isAuthenticated" class="bg-primary-container text-on-primary-container p-4 flex flex-wrap gap-4 items-center font-medium shadow-md">
      <router-link
        v-for="navRoute in navigationRoutes"
        :key="navRoute.path"
        :to="navRoute.path"
        class="hover:text-on-primary-container/80 transition-colors"
        active-class="font-bold"
      >
        {{ navRoute.meta?.title?.toString() || navRoute.name }}
      </router-link>

      <button
        type="button"
        class="px-4 py-2 bg-secondary text-on-secondary rounded-lg transition-colors hover:opacity-90 ml-auto"
        @click="openModal"
      >
        Open Modal
      </button>

      <div class="flex items-center gap-4">
        <span class="text-sm">{{ authStore.user?.name }}</span>
        <button
          type="button"
          @click="handleLogout"
          class="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </nav>

    <router-view v-slot="{ Component, route }">
      <LifecycleHost :key="route.fullPath">
        <component :is="Component" />
      </LifecycleHost>
    </router-view>

    <ModalExample v-if="authStore.isAuthenticated" ref="modalExampleRef" />
  </div>
</template>
