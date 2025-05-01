<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { User } from '@/interfaces/interfaces'

const props = defineProps<{
  isOpen: boolean
  action: 'activate' | 'deactivate'
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const actionInfo = {
  activate: {
    title: 'Activate User',
    question: props.user ? `Are you sure you want to activate ${props.user.firstName} ${props.user.lastName}?` : 'Are you sure you want to activate this user?',
    effects: [
      'User will be able to log in to the platform',
      'User profile will be visible to other users',
      'User will be able to use all platform features'
    ],
    confirmText: 'Activate User',
    confirmClass: 'bg-green-600 hover:bg-green-700'
  },
  deactivate: {
    title: 'Deactivate User',
    question: props.user ? `Are you sure you want to deactivate ${props.user.firstName} ${props.user.lastName}?` : 'Are you sure you want to deactivate this user?',
    effects: [
      'User will not be able to log in to the platform',
      'User profile will be hidden from other users',
      'User data will be preserved for future reactivation'
    ],
    confirmText: 'Deactivate User',
    confirmClass: 'bg-red-600 hover:bg-red-700'
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div
        class="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="p-6 space-y-5">
          <!-- Close button -->
          <button
            @click="emit('cancel')"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="text-center">
            <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ actionInfo[action].title }}</h3>
            <p class="mt-2 text-sm text-gray-600">{{ actionInfo[action].question }}</p>
          </div>

          <!-- Effects -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">What happens when you {{ action }} a user:</h4>
            <ul class="space-y-2">
              <li v-for="(effect, index) in actionInfo[action].effects" :key="index" class="flex items-start">
                <svg class="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-600">{{ effect }}</span>
              </li>
            </ul>
            <p class="text-xs text-gray-500 mt-3">
              You can change user status at any time from the admin panel.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="emit('cancel')"
              class="px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              @click="emit('confirm')"
              :class="[
                'px-4 py-2 rounded-full shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                actionInfo[action].confirmClass
              ]"
            >
              {{ actionInfo[action].confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 