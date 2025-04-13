<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50" @click="handleCancel"></div>
    <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all">
      <h3 class="text-lg font-semibold text-text-primary mb-2">Sign Out Confirmation</h3>
      <p class="text-text-secondary mb-6">Are you sure you want to sign out?</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>
