<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-16">
    <div class="max-w-md w-full text-center space-y-8">
      <div class="space-y-4">
        <h1 class="text-6xl font-bold text-primary">404</h1>
        <h2 class="text-2xl font-semibold text-text-primary">Page Not Found</h2>
        <p class="text-text-secondary">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="px-6 py-2.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
        >
          Go Back
        </button>
        <button
          @click="goHome"
          class="px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>
