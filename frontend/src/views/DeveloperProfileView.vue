<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Developer } from '../interfaces/interfaces'
import { mockDevelopers } from '../data/mockData'

const router = useRouter()
const route = useRoute()

const developer = ref<Developer | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Function to fetch developer profile
async function fetchDeveloperProfile(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const numericId = parseInt(id.replace(/\D/g, ''))
    if (isNaN(numericId)) {
      throw new Error('Invalid developer ID')
    }

    const profile = mockDevelopers.find(dev => dev.id === numericId)
    if (!profile) {
      throw new Error('Developer not found')
    }

    return profile
  } catch (e) {
    throw new Error('Failed to load developer profile')
  }
}

const actions = [
  { name: 'mute', title: 'Mute this developer' },
  { name: 'block', title: 'Block this developer' },
  { name: 'report', title: 'Report this developer' }
]

onMounted(async () => {
  try {
    const developerId = route.params.id as string
    developer.value = await fetchDeveloperProfile(developerId)
    isLoading.value = false
  } catch (e) {
    error.value = (e as Error).message
    isLoading.value = false
  }

})

const goBack = () => {
  router.back()
}

const initiateChat = () => {
  // Implement chat initiation logic
  router.push(`/chat/${developer.value?.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-500 to-purple-100 py-16">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
      <!-- Return Button -->
      <button
        @click="goBack"
        class="mb-8 inline-flex items-center px-4 py-2 bg-white/90 text-indigo-600 rounded-lg hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>

      <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-indigo-900/20 backdrop-blur-sm z-50">
        <div class="bg-white/90 p-12 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 transform hover:scale-[1.01] transition-all duration-300">
          <div class="relative">
            <div class="w-24 h-24 border-8 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
            <div class="absolute inset-0 w-24 h-24 border-8 border-transparent rounded-full animate-pulse bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30"></div>
          </div>
          <p class="text-2xl text-indigo-900 font-medium animate-pulse">Loading developer profile...</p>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12 bg-white/90 rounded-3xl shadow-xl">
        <div class="text-red-600 text-xl">{{ error }}</div>
      </div>

      <div v-else-if="developer" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <!-- Left Column: Profile Information -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Profile Info Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <div class="flex flex-col space-y-6">
              <div class="flex items-start space-x-8">
                <div class="relative flex-shrink-0">
                  <div class="h-40 w-40 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                    <div class="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white">
                      <img :src="developer.avatar" :alt="developer.name" class="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
                <div class="flex-1 space-y-4">
                  <div class="flex justify-between items-start">
                    <div>
                      <h1 class="text-4xl font-bold text-gray-900 tracking-tight">{{ developer.name }}</h1>
                      <p class="text-lg text-indigo-600 font-medium">{{ developer.location }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        v-for="action in actions"
                        :key="action.name"
                        class="p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-200"
                        :title="action.title"
                      >
                        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24">
                          <path v-if="action.name === 'mute'" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" class="stroke-indigo-500" />
                          <path v-if="action.name === 'block'" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" class="stroke-red-500" />
                          <path v-if="action.name === 'report'" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" class="stroke-amber-500" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="skill in developer.skills" :key="skill"
                      class="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-all duration-200 shadow-sm">
                      {{ skill }}
                    </span>
                  </div>
                  <button
                    @click="initiateChat"
                    class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- About Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">About</h3>
            <p class="text-gray-600 leading-relaxed">{{ developer.bio }}</p>
          </div>

          <!-- Skills Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Skills</h3>
            <div class="flex flex-wrap gap-3">
              <span v-for="skill in developer.skills" :key="skill"
                class="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-all duration-200 shadow-sm">
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <dl class="grid grid-cols-1 gap-6">
              <div class="space-y-2">
                <dt class="text-sm font-semibold text-gray-500">Location</dt>
                <dd class="text-lg text-gray-900">{{ developer.location }}</dd>
              </div>
              <div class="space-y-2">
                <dt class="text-sm font-semibold text-gray-500">Email</dt>
                <dd class="text-lg text-gray-900">{{ developer.email }}</dd>
              </div>
            </dl>
          </div>

          <!-- Social Links Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Social Links</h3>
            <div class="flex flex-col space-y-4">
              <a
                v-if="developer.githubUrl"
                :href="developer.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span class="text-gray-700 font-medium">GitHub Profile</span>
              </a>
              <a
                v-if="developer.linkedinUrl"
                :href="developer.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span class="text-gray-700 font-medium">LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Portfolio Album -->
        <div class="lg:col-span-5 space-y-8">
          <!-- Album Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Portfolio Album</h3>
            <div class="grid grid-cols-1 gap-6">
              <div
                v-for="image in developer.album"
                :key="image.id"
                class="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  :src="image.url"
                  :alt="image.caption || 'Album photo'"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="text-sm font-medium truncate">{{ image.caption }}</p>
                        <p class="text-xs opacity-75">{{ new Date(image.uploadedAt).toLocaleDateString() }}</p>
                      </div>
                      <button
                        class="p-2 text-white hover:text-red-500 transition-colors duration-200"
                        title="Report this image"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="!developer.album?.length" class="text-center py-12">
                <div class="mx-auto w-24 h-24 mb-6 text-indigo-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-2">No portfolio images available</h4>
                <p class="text-gray-500">This developer hasn't added any portfolio images yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
