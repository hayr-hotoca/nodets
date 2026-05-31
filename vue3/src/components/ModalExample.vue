<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

// Expose methods to parent
defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Example Modal"
    size="lg"
    @close="closeModal"
  >
    <div class="space-y-4">
      <p class="text-gray-700">
        This is an example modal component using Vue Teleport. The modal is
        rendered outside the normal DOM flow and appended to the body element.
      </p>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-semibold text-blue-900 mb-2">Features:</h3>
        <ul class="list-disc list-inside text-blue-800 space-y-1">
          <li>Vue Teleport for portal rendering</li>
          <li>Smooth enter/leave transitions</li>
          <li>Click outside to close</li>
          <li>Escape key to close</li>
          <li>Responsive sizing</li>
          <li>Customizable header and footer slots</li>
        </ul>
      </div>
      <p class="text-sm text-gray-500">
        Try clicking the overlay or pressing Escape to close this modal.
      </p>
    </div>

    <template #footer>
      <button
        type="button"
        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        type="button"
        class="px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
        @click="closeModal"
      >
        Confirm
      </button>
    </template>
  </Modal>
</template>
