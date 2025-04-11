<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMatchStore } from '@/stores/matchStore'

const matchStore = useMatchStore()
const isLoading = ref(true)

// Mock data for development
const mockMatches = [
  {
    id: 1,
    status: 'pending',
    matchedAt: new Date().toISOString(),
    developer: {
      id: 1,
      name: 'Sarah Chen',
      location: 'San Francisco, CA',
      bio: 'Full-stack developer passionate about building scalable web applications. Experience with React, Node.js, and cloud architecture.',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=5C6AC4&color=fff',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB']
    }
  },
  {
    id: 2,
    status: 'accepted',
    matchedAt: new Date(Date.now() - 86400000).toISOString(),
    developer: {
      id: 2,
      name: 'Alex Rodriguez',
      location: 'New York, NY',
      bio: 'Frontend specialist with a keen eye for design. Love creating beautiful and accessible user interfaces.',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Rodriguez&background=9C6ADE&color=fff',
      skills: ['Vue.js', 'CSS', 'UI/UX', 'Accessibility', 'Figma']
    }
  },
  {
    id: 3,
    status: 'pending',
    matchedAt: new Date().toISOString(),
    developer: {
      id: 3,
      name: 'Maya Patel',
      location: 'London, UK',
      bio: 'Backend developer specializing in microservices and distributed systems. Always eager to learn new technologies.',
      avatar: 'https://ui-avatars.com/api/?name=Maya+Patel&background=22C55E&color=fff',
      skills: ['Go', 'Python', 'Docker', 'Kubernetes', 'gRPC']
    }
  }
]

onMounted(async () => {
  // Simulate API call with mock data
  setTimeout(() => {
    matchStore.matches = mockMatches
    isLoading.value = false
  }, 1000)
})

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()

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
          <button class="rounded-xl bg-white/80 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-primary border border-primary/10 hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-md">
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              <span>Filter</span>
            </span>
          </button>
          <button class="rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105">
            <span class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Find New Matches</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="animate-pulse h-8 w-8 rounded-full bg-primary/20"></div>
        </div>
      </div>
    </div>

    <div v-else-if="matchStore.matches.length === 0" class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/5">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <h3 class="text-xl font-semibold text-text-primary">No matches yet</h3>
        <p class="text-text-secondary max-w-md">Start matching with other developers to connect and collaborate on exciting projects!</p>
        <button @click="emit('update:activeTab', 'match-cards')" class="mt-6 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
          Find Matches
        </button>
      </div>
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
