<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMatchStore } from '../stores/matchStore'

const emit = defineEmits(['update:activeTab'])
const matchStore = useMatchStore()
const firstName = ref('John')
const profileCompletion = ref(80)

onMounted(async () => {
  await matchStore.fetchMatches()
})

const recentMatches = matchStore.recentMatches.map(match => ({
  id: match.developer.id,
  name: match.developer.name,
  avatar: match.developer.avatar,
  location: match.developer.location,
}))

const stats = matchStore.matchStats

const navigateToProfile = () => {
  emit('update:activeTab', 'profile')
}

const navigateToMatches = () => {
  emit('update:activeTab', 'matches')
}

const startBrowsing = () => {
  emit('update:activeTab', 'browse')
}
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Banner -->
    <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 shadow-sm">
      <h1 class="text-3xl font-bold text-text-primary mb-2">Welcome back, {{ firstName }}! 👋</h1>
      <div class="flex items-center space-x-4">
        <div class="flex-1 bg-white/50 rounded-full h-2 overflow-hidden">
          <div class="bg-primary h-full rounded-full" :style="{ width: `${profileCompletion}%` }"></div>
        </div>
        <span class="text-sm text-text-secondary font-medium">{{ profileCompletion }}% Complete</span>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button @click="navigateToProfile"
        class="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <font-awesome-icon icon="user" class="w-6 h-6 text-primary" />
          </div>
          <font-awesome-icon icon="arrow-right"
            class="w-5 h-5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-1">Update Profile</h3>
        <p class="text-sm text-text-secondary">Complete your profile to get better matches</p>
      </button>

      <button @click="startBrowsing"
        class="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <font-awesome-icon icon="search" class="w-6 h-6 text-primary" />
          </div>
          <font-awesome-icon icon="arrow-right"
            class="w-5 h-5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-1">Browse Developers</h3>
        <p class="text-sm text-text-secondary">Discover and connect with talented developers</p>
      </button>

      <button @click="navigateToMatches"
        class="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-200">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <font-awesome-icon icon="comments" class="w-6 h-6 text-primary" />
          </div>
          <font-awesome-icon icon="arrow-right"
            class="w-5 h-5 text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
        </div>
        <h3 class="text-lg font-semibold text-text-primary mb-1">View Matches</h3>
        <p class="text-sm text-text-secondary">Check your matches and start conversations</p>
      </button>
    </div>

    <!-- Recent Matches -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-xl font-semibold text-text-primary mb-4">Recent Matches 🧑‍💻</h2>
      <div v-if="recentMatches.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="match in recentMatches" :key="match.id"
          class="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-200">
          <img :src="match.avatar" :alt="match.name" class="w-10 h-10 rounded-full bg-gray-100" />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-text-primary truncate">{{ match.name }}</h3>
            <p class="text-xs text-text-secondary truncate">{{ match.location }}</p>
          </div>
          <button
            class="shrink-0 px-2.5 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors duration-200">
            Message
          </button>
        </div>
      </div>
      <div v-else class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <font-awesome-icon icon="users" class="w-8 h-8 text-primary" />
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">No Recent Matches</h3>
        <p class="text-text-secondary">Start browsing to find your perfect match!</p>
        <button @click="startBrowsing" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200">
          Browse Developers
        </button>
      </div>
    </div>

    <!-- Developer Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-text-secondary">Developers liked you</h3>
          <span class="text-2xl font-bold text-primary">{{ stats.likesReceived }}</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1">
          <div class="bg-primary h-full rounded-full" style="width: 40%"></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-text-secondary">Developers you liked</h3>
          <span class="text-2xl font-bold text-primary">{{ stats.likesSent }}</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1">
          <div class="bg-primary h-full rounded-full" style="width: 60%"></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-text-secondary">Total matches</h3>
          <span class="text-2xl font-bold text-primary">{{ stats.totalMatches }}</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1">
          <div class="bg-primary h-full rounded-full" style="width: 20%"></div>
        </div>
      </div>
    </div>
  </div>
</template>
