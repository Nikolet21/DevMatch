<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{
  image: {
    id: string
    url: string
    caption: string
  }
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="relative max-w-7xl max-h-[90vh] mx-4">
      <!-- Close button -->
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Image container -->
      <div class="relative">
        <img
          :src="image.url"
          :alt="image.caption"
          class="max-h-[85vh] object-contain"
        />
        <p v-if="image.caption" class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center">
          {{ image.caption }}
        </p>
      </div>
    </div>
  </div>
</template>
