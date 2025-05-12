<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useMatchStore } from '../stores/matchStore'
import { useUserStore } from '../stores/userStore'
import { useProfileStore } from '../stores/profileStore'
import { useActivityStore } from '../stores/activityStore'
import { formatActivityDate, getActivityIcon } from '../utils/activityUtils'
import router from '@/router/router'

const emit = defineEmits(['update:activeTab'])
const matchStore = useMatchStore()
const userStore = useUserStore()
const profileStore = useProfileStore()
const activityStore = useActivityStore()
const isLoading = ref(true)

const firstName = computed(() => userStore.currentUser?.firstName || 'Developer')
const fullName = computed(() => {
  const first = userStore.currentUser?.firstName || ''
  const last = userStore.currentUser?.lastName || ''
  return [first, last].filter(Boolean).join(' ') || 'Developer'
})

const avatar = computed(() => userStore.user?.avatar || '')

// Profile completion calculation
const profileCompletion = computed(() => {
  const profile = profileStore.profile
  let completedFields = 0
  let totalFields = 6 // firstName, lastName, bio, skills, githubUrl, avatar

  if (profile?.firstName) completedFields++
  if (profile?.lastName) completedFields++
  if (profile?.bio) completedFields++
  if (Array.isArray(profile?.skills) && profile.skills.length > 0) completedFields++
  if (profile?.githubUrl) completedFields++
  if (userStore.user?.avatar) completedFields++

  return Math.round((completedFields / totalFields) * 100)
})

// Profile completion status text and color
const completionStatus = computed(() => {
  const completion = profileCompletion.value
  if (completion < 40) return { text: 'Incomplete', color: 'text-red-500', bg: 'bg-red-500' }
  if (completion < 70) return { text: 'In Progress', color: 'text-amber-500', bg: 'bg-amber-500' }
  if (completion < 100) return { text: 'Almost Complete', color: 'text-emerald-500', bg: 'bg-emerald-500' }
  return { text: 'Complete', color: 'text-primary', bg: 'bg-primary' }
})

// Profile missing items
const missingProfileItems = computed(() => {
  const profile = profileStore.profile
  const missing = []

  if (!profile?.firstName || !profile?.lastName) missing.push('Full Name')
  if (!profile?.bio) missing.push('Bio')
  if (!Array.isArray(profile?.skills) || profile.skills.length === 0) missing.push('Skills')
  if (!profile?.githubUrl) missing.push('GitHub URL')
  if (!userStore.user?.avatar) missing.push('Profile Picture')

  return missing
})

// Recent activity logs, filtered to exclude security entries
const recentActivityLogs = computed(() => {
  // Filter out security-related entries and get the latest 5 entries
  return activityStore.activityLogs
    .filter(log => log.category !== 'Security')
    .slice(0, 5)
    .map(log => ({
      id: log.id,
      type: log.category.toLowerCase(),
      message: log.description,
      date: formatTimeAgo(log.timestamp),
      icon: getActivityIcon(log.category),
      rawDate: log.timestamp
    }))
})

// Format a date as time ago (e.g., "2 hours ago", "3 days ago")
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // If less than 24 hours, show "X hours ago" or "X minutes ago"
  if (diff < 24 * 60 * 60 * 1000) {
    // If less than 60 minutes, show in minutes
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    
    // Otherwise show in hours
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  
  // If less than 7 days, show "X days ago"
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  
  // Otherwise format as date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    await Promise.all([
      matchStore.fetchMatches(),
      activityStore.loadActivityLogs() // Load activity logs on mount
    ])
    // Profile should already be loaded from the parent component
    isLoading.value = false
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    isLoading.value = false
  }
})

const recentMatches = computed(() => {
  return matchStore.recentMatches.map(match => ({
    id: match.developer.id,
    name: match.developer.name,
    avatar: match.developer.avatar,
    location: match.developer.location,
    skills: match.developer.skills?.slice(0, 3) || [],
    matchDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) // Fallback to current date since timestamp is not available
  }))
})

const stats = matchStore.matchStats

const navigateToProfile = () => {
  router.push('/profile')
}

const navigateToMatches = () => {
  emit('update:activeTab', 'matches')
}

const startBrowsing = () => {
  emit('update:activeTab', 'browse')
}
</script>

<template>
  <div class="space-y-6 px-1 w-full">
    <!-- Main Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Profile Overview & Actions -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Profile Card -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-200/50 overflow-hidden">
          <div class="h-24 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
          <div class="px-6 pb-6 -mt-12">
            <div class="flex justify-between items-end mb-4">
              <div class="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                <img v-if="avatar" :src="avatar" :alt="fullName" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full bg-primary/10 flex items-center justify-center">
                  <font-awesome-icon icon="user" class="text-3xl text-primary/50" />
                </div>
              </div>
              <button @click="navigateToProfile" class="text-sm text-primary font-medium hover:underline">
                Edit Profile
              </button>
            </div>
            <h2 class="text-xl font-bold text-gray-800 break-words">{{ fullName }}</h2>
            <p class="text-sm text-gray-500 break-words">{{ userStore.currentUser?.email }}</p>
            
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-600">Profile Completion</span>
                <span class="text-sm font-semibold" :class="completionStatus.color">
                  {{ profileCompletion }}% · {{ completionStatus.text }}
                </span>
              </div>
              <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :class="completionStatus.bg" :style="{ width: `${profileCompletion}%` }"></div>
              </div>
              
              <div v-if="missingProfileItems.length > 0" class="mt-4">
                <p class="text-sm text-gray-600 mb-2">Missing information:</p>
                <ul class="space-y-1">
                  <li v-for="item in missingProfileItems" :key="item" class="text-sm text-gray-500 flex items-center">
                    <font-awesome-icon icon="circle-exclamation" class="text-amber-400 mr-2 w-4 h-4" />
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-200/50 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Your Activity</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <font-awesome-icon icon="heart" class="text-blue-500" />
                </div>
                <span class="text-sm text-gray-600">Developers liked you</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ stats.likesReceived }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                  <font-awesome-icon icon="paper-plane" class="text-pink-500" />
                </div>
                <span class="text-sm text-gray-600">Developers you liked</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ stats.likesSent }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <font-awesome-icon icon="code-branch" class="text-green-500" />
                </div>
                <span class="text-sm text-gray-600">Total matches</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ stats.totalMatches }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column - Content Area -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-white rounded-2xl shadow-md p-6 relative overflow-hidden">
          <div class="absolute bottom-0 right-0 w-32 h-32 opacity-20">
            <font-awesome-icon icon="code" class="w-full h-full text-primary" />
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-1">Welcome back, {{ firstName }}!</h1>
          <p class="text-gray-600 max-w-xl">
            Continue exploring developer profiles, connecting with potential collaborators, and working on your projects together.
          </p>
          
          <div class="mt-6 flex flex-wrap gap-3">
            <button @click="startBrowsing" class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-sm hover:shadow">
              <font-awesome-icon icon="search" class="mr-2" />
              Browse Developers
            </button>
            <button @click="navigateToMatches" class="inline-flex items-center px-4 py-2 bg-white text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition shadow-sm hover:shadow">
              <font-awesome-icon icon="comments" class="mr-2" />
              View Matches
            </button>
          </div>
        </div>
        
        <!-- Recent Matches -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-200/50 p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-800">Recent Matches</h2>
            <button @click="navigateToMatches" v-if="recentMatches.length > 0" class="text-sm text-primary hover:underline">
              View All
            </button>
          </div>
          
          <div v-if="recentMatches.length > 0" class="space-y-4">
            <div v-for="match in recentMatches.slice(0, 3)" :key="match.id" 
                 class="bg-gray-50/80 rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:bg-gray-50 transition border border-gray-100">
              <img :src="match.avatar" :alt="match.name" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
              
              <div class="flex-1 min-w-0 text-center sm:text-left">
                <div class="flex flex-col sm:flex-row justify-between items-center sm:items-start">
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ match.name }}</h3>
                    <p class="text-sm text-gray-500">{{ match.location }}</p>
                  </div>
                  <span class="text-xs text-gray-400 mt-1 sm:mt-0">Matched {{ match.matchDate }}</span>
                </div>
                
                <div class="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span v-for="skill in match.skills" :key="skill" class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {{ skill }}
                  </span>
                </div>
              </div>
              
              <button class="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition shadow-sm hover:shadow flex items-center">
                <font-awesome-icon icon="message" class="mr-2" />
                Chat
              </button>
            </div>
          </div>
          
          <div v-else class="py-12 text-center">
            <div class="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="users" class="w-10 h-10 text-primary/50" />
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">No Matches Yet</h3>
            <p class="text-gray-500 max-w-sm mx-auto mb-6">Start browsing to find developers with similar interests and skills</p>
            <button @click="startBrowsing" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-sm hover:shadow">
              Browse Developers
            </button>
          </div>
        </div>
        
        <!-- Activity Timeline -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-200/50 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h2>
          
          <div v-if="recentActivityLogs.length > 0" class="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:ml-px before:border-l-2 before:border-gray-200">
            <div v-for="activity in recentActivityLogs" :key="activity.id" class="pl-10 relative">
              <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white z-10">
                <font-awesome-icon :icon="activity.icon" class="text-primary text-sm" />
              </div>
              
              <div>
                <p class="font-medium text-gray-800">{{ activity.message }}</p>
                <span class="text-xs text-gray-500">{{ activity.date }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="py-8 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="clock-rotate-left" class="w-8 h-8 text-primary/50" />
            </div>
            <h3 class="text-base font-medium text-gray-700 mb-2">No Recent Activity</h3>
            <p class="text-gray-500 text-sm max-w-sm mx-auto">Your recent activity will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Make sure content fills available space */
.grid {
  width: 100%;
  max-width: 100%;
}

/* Add smooth transitions */
.grid > div {
  transition: all 0.3s ease;
}

/* Ensure proper spacing on mobile */
@media (max-width: 768px) {
  .space-y-6 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
