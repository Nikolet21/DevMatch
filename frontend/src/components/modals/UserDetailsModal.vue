<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { User, AlbumImage } from '@/interfaces/interfaces'

const props = defineProps<{
  isOpen: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Helper to get image URL from AlbumImage object
const getImageUrl = (image: AlbumImage): string => {
  return typeof image === 'string' ? image : image.url
}
</script>

<template>
  <div v-if="isOpen && user" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-gray-900/80 backdrop-blur-sm" aria-hidden="true" @click="emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
        <!-- Modal header with gradient background -->
        <div class="relative px-6 py-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <!-- User avatar and basic info -->
          <div class="flex items-center">
            <div class="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg border-4 border-white">
              <span class="text-white text-xl font-bold">
                {{ (user.firstName?.[0] || '') + (user.lastName?.[0] || '') }}
              </span>
            </div>
            <div class="ml-5">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {{ user.firstName }} {{ user.lastName }}
              </h3>
              <p class="text-sm text-text-secondary mt-1">{{ user.email }}</p>
              
              <div class="flex items-center gap-3 mt-2">
                <span class="px-3 py-1 text-xs font-medium rounded-full capitalize" 
                  :class="{
                    'bg-primary/15 text-primary': user.role === 'admin',
                    'bg-secondary/15 text-secondary': user.role === 'developer' || user.role === 'user'
                  }">
                  {{ user.role === 'user' ? 'Developer' : user.role }}
                </span>
                
                <span class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': user.status === 'Active',
                    'bg-red-100 text-red-800': user.status === 'Inactive'
                  }">
                  {{ user.status }}
                </span>
              </div>
            </div>
            
            <!-- Close button -->
            <button
              @click="emit('close')"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal content -->
        <div class="px-6 py-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div class="space-y-6">
            <!-- Bio section -->
            <div v-if="user.bio" class="bg-gray-50 rounded-xl p-5 shadow-sm">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About
              </h4>
              <p class="text-sm text-gray-600 leading-relaxed">{{ user.bio }}</p>
            </div>

            <!-- Skills section -->
            <div v-if="user.skills && user.skills.length > 0" class="bg-gray-50 rounded-xl p-5 shadow-sm">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Skills
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(skill, index) in user.skills" 
                  :key="index"
                  class="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-secondary/20"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Social Links section -->
            <div class="bg-gray-50 rounded-xl p-5 shadow-sm">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Social Links
              </h4>
              <div class="space-y-3">
                <div v-if="user.githubUrl" class="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <a :href="user.githubUrl" target="_blank" class="text-sm text-primary hover:underline">GitHub Profile</a>
                </div>
                
                <div v-if="user.linkedinUrl" class="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <a :href="user.linkedinUrl" target="_blank" class="text-sm text-primary hover:underline">LinkedIn Profile</a>
                </div>
                
                <p v-if="!user.githubUrl && !user.linkedinUrl" class="text-sm text-gray-500 italic text-center py-2">
                  No social links available
                </p>
              </div>
            </div>

            <!-- Album preview section -->
            <div v-if="user.album && user.album.length > 0" class="bg-gray-50 rounded-xl p-5 shadow-sm">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Portfolio
              </h4>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="(image, index) in user.album.slice(0, 6)" :key="index" 
                  class="aspect-square rounded-lg overflow-hidden shadow-sm group relative">
                  <img :src="getImageUrl(image)" alt="Portfolio image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span class="text-xs text-white font-medium truncate">
                      {{ typeof image === 'string' ? `Image ${index + 1}` : image.caption }}
                    </span>
                  </div>
                </div>
              </div>
              <p v-if="user.album.length > 6" class="text-xs text-gray-500 mt-3 text-right">
                +{{ user.album.length - 6 }} more images
              </p>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            @click="emit('close')"
            class="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(92, 106, 196, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(92, 106, 196, 0.5);
  border-radius: 20px;
}
</style> 