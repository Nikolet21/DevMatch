<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  imageUrl: string
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const hasImage = computed(() => !!props.imageUrl)
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden transform transition-all">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-900">Update Profile Picture</h3>
      </div>

      <!-- Modal Body -->
      <div class="p-6">
        <div class="flex flex-col items-center space-y-4">
          <!-- Avatar Preview -->
          <div class="relative w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-4 border-indigo-500 shadow-lg">
            <img
              v-if="hasImage"
              :src="imageUrl"
              alt="Profile preview"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <!-- Preview Text -->
          <p class="text-sm text-gray-600 text-center">
            This is how your profile picture will appear to other users
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          v-if="hasImage"
          @click="emit('confirm')"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Profile Picture
        </button>
      </div>
    </div>
  </div>
</template>
