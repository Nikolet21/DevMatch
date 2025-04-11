<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  imageId: string
  imageName?: string
}>()

const emit = defineEmits<{
  confirm: [imageId: string]
  close: []
}>()

const handleConfirm = () => {
  emit('confirm', props.imageId)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div
      class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all shadow-xl"
      @click.stop
    >
      <div class="text-center mb-6">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            class="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Delete Image</h3>
        <p class="text-sm text-gray-500">
          Are you sure you want to delete this image{{ props.imageName ? `: ${props.imageName}` : '' }}? This action cannot be undone.
        </p>
      </div>
      <div class="flex justify-end space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
