<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMatchStore } from '@/stores/matchStore'

const matchStore = useMatchStore()
const emit = defineEmits(['update:activeTab'])

onMounted(async () => {
  await matchStore.fetchMatches()
})

const isLoading = computed(() => matchStore.isLoading)
const hasError = computed(() => matchStore.error !== null)

const handleConnect = async (matchId: number) => {
  await matchStore.updateMatchStatus(matchId, 'accepted')
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Developer Matches</h1>
          <p class="text-text-secondary mt-2">Connect with talented developers who match your interests</p>
        </div>
        <div class="flex space-x-4">
          <button @click="emit('update:activeTab', 'browse')" class="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Find New Matches</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/5">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-text-secondary">Loading your matches...</p>
    </div>

    <div v-else-if="hasError" class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-red-200">
      <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <font-awesome-icon icon="exclamation-triangle" class="w-8 h-8 text-red-500" />
      </div>
      <h2 class="text-xl font-semibold text-red-600 mb-2">Error Loading Matches</h2>
      <p class="text-text-secondary mb-6">{{ matchStore.error }}</p>
      <button @click="matchStore.fetchMatches()" class="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md">
        Try Again
      </button>
    </div>

    <div v-else-if="matchStore.matches.length === 0" class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/5">
      <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
        <font-awesome-icon icon="users" class="w-8 h-8 text-primary" />
      </div>
      <h2 class="text-xl font-semibold text-text-primary mb-2">No Matches Yet</h2>
      <p class="text-text-secondary mb-6">Start browsing to find your perfect match!</p>
      <button @click="$emit('update:activeTab', 'browse')" class="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors duration-200 shadow-sm hover:shadow-md">
        Browse Developers
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <div v-for="match in matchStore.matches" :key="match.id" class="group relative bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div class="relative p-6 space-y-6">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="relative rounded-full p-1 bg-gradient-to-r from-primary to-secondary">
                <img :src="match.developer.avatar" :alt="match.developer.name" class="h-14 w-14 rounded-full object-cover ring-2 ring-white" />
              </div>
              <div class="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white shadow-sm" :class="match.status === 'accepted' ? 'bg-success' : 'bg-secondary'"></div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                {{ match.developer.name }}
              </h3>
              <p class="text-text-secondary flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{{ match.developer.location }}</span>
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-text-secondary leading-relaxed">{{ match.developer.bio }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in match.developer.skills" :key="skill" class="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full border border-primary/5 transition-all duration-200 hover:border-primary/20">
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="pt-4 flex justify-between items-center border-t border-primary/5">
            <div class="text-sm">
              <span v-if="match.status === 'accepted'" class="text-success flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Connected {{ new Date(match.matchedAt).toLocaleDateString() }}</span>
              </span>
              <span v-else class="text-secondary flex items-center space-x-1">
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Pending...</span>
              </span>
            </div>
            <button v-if="match.status === 'pending'" @click="handleConnect(match.id)" class="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-300 hover:shadow-md transform hover:scale-105">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
