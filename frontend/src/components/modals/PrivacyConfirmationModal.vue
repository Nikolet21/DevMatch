<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  isOpen: boolean
  action: 'mute' | 'unmute' | 'block' | 'unblock'
  userName: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const actionInfo = {
  mute: {
    title: 'Mute User',
    question: `Are you sure you want to mute ${props.userName}?`,
    effects: [
      'You will not receive notifications from this user',
      'You will still see their messages in existing chats',
      'They won\'t know they\'ve been muted'
    ],
    confirmText: 'Mute User',
    confirmClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  unmute: {
    title: 'Unmute User',
    question: `Are you sure you want to unmute ${props.userName}?`,
    effects: [
      'You will start receiving notifications from this user again',
      'You will continue to see their messages in existing chats'
    ],
    confirmText: 'Unmute User',
    confirmClass: 'bg-indigo-600 hover:bg-indigo-700'
  },
  block: {
    title: 'Block User',
    question: `Are you sure you want to block ${props.userName}?`,
    effects: [
      'They won\'t be able to message you or see your profile',
      'You won\'t see their messages or match with them',
      'Existing conversations will be hidden',
      'They won\'t know they\'ve been blocked'
    ],
    confirmText: 'Block User',
    confirmClass: 'bg-red-600 hover:bg-red-700'
  },
  unblock: {
    title: 'Unblock User',
    question: `Are you sure you want to unblock ${props.userName}?`,
    effects: [
      'They will be able to message you and see your profile again',
      'Previously hidden conversations will be visible again',
      'You might see them in your potential matches'
    ],
    confirmText: 'Unblock User',
    confirmClass: 'bg-indigo-600 hover:bg-indigo-700'
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
            <h3 class="text-lg font-medium text-gray-900">{{ actionInfo[action].title }}</h3>
            <p class="mt-2 text-sm text-gray-500">{{ actionInfo[action].question }}</p>
          </div>

          <!-- Effects -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">What happens when you {{ action }} a user:</h4>
            <ul class="space-y-2">
              <li v-for="(effect, index) in actionInfo[action].effects" :key="index" class="flex items-start">
                <svg class="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-gray-600">{{ effect }}</span>
              </li>
            </ul>
            <p class="text-xs text-gray-500 mt-3">
              You can change these privacy settings at any time in your settings.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button
              @click="emit('cancel')"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              @click="emit('confirm')"
              :class="[
                'px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
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