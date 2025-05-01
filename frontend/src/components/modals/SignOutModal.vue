<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue'

const emit = defineEmits(['confirm', 'cancel'])
const isClosing = ref(false)

onMounted(() => {
  // Prevent scrolling when modal is open
  document.body.style.overflow = 'hidden'
  return () => {
    document.body.style.overflow = ''
  }
})

const closeWithAnimation = () => {
  isClosing.value = true
  setTimeout(() => {
    emit('cancel')
  }, 200)
}

const confirmWithAnimation = () => {
  isClosing.value = true
  setTimeout(() => {
    emit('confirm')
  }, 200)
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop with blur effect -->
    <div 
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
      :class="{ 'opacity-0': isClosing }"
      @click="closeWithAnimation"
    ></div>
    
    <!-- Modal Content -->
    <div 
      class="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-200 border border-gray-200/50"
      :class="{ 'scale-95 opacity-0': isClosing, 'scale-100 opacity-100': !isClosing }"
    >
      <div class="absolute top-4 right-4">
        <button
          @click="closeWithAnimation"
          class="p-1.5 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-500 transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="text-center mb-4">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-text-primary">Sign Out</h3>
        <p class="text-text-secondary mt-2 mb-6">Are you sure you want to sign out of your admin account?</p>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="closeWithAnimation"
          class="px-4 py-3 rounded-xl border border-gray-200 text-text-primary hover:bg-gray-50 transition-colors duration-200 font-medium text-sm"
        >
          Cancel
        </button>
        <button
          @click="confirmWithAnimation"
          class="px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scale-100 {
  transform: scale(1);
}

.scale-95 {
  transform: scale(0.95);
}
</style>
