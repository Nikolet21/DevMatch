<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useReportStore } from '@/stores/reportStore'
import { useMatchStore } from '@/stores/matchStore'

// Import chart components
import UserRoleDistributionChart from './charts/UserRoleDistributionChart.vue'
import UserGrowthChart from './charts/UserGrowthChart.vue'
import ReportStatusChart from './charts/ReportStatusChart.vue'
import SkillsAnalysisChart from './charts/SkillsAnalysisChart.vue'

// Initialize stores
const userStore = useUserStore()
const reportStore = useReportStore()
const matchStore = useMatchStore()
const animatedElements = ref<HTMLElement[]>([])

// Load data
onMounted(async () => {
  await userStore.fetchAllUsers()
  await reportStore.fetchReports()
  await matchStore.fetchMatches()
  
  // Animation setup
  animatedElements.value = Array.from(document.querySelectorAll('.animate-on-scroll'))
  
  // Initial check for elements in viewport
  setTimeout(() => {
    animatedElements.value.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible')
      }, index * 100)
    })
  }, 100)
})

const stats = [
  { 
    id: 1, 
    title: 'Total Developers', 
    value: computed(() => userStore.adminUsers.filter(u => u.role === 'developer' || u.role === 'user').length), 
    change: '+12%', 
    icon: 'users',
    bgGradient: 'from-primary/10 to-primary/20',
    textColor: 'text-primary'
  },
  { 
    id: 2, 
    title: 'Active Developers', 
    value: computed(() => userStore.adminUsers.filter(u => (u.role === 'developer' || u.role === 'user') && u.status === 'Active').length), 
    change: '+7%', 
    icon: 'code',
    bgGradient: 'from-secondary/10 to-secondary/20',
    textColor: 'text-secondary'
  },
  { 
    id: 3, 
    title: 'Successful Matches', 
    value: computed(() => matchStore.matches.filter(m => m.status === 'accepted').length), 
    change: '+18%', 
    icon: 'user-check',
    bgGradient: 'from-purple-500/10 to-purple-600/20',
    textColor: 'text-purple-600'
  },
  { 
    id: 4, 
    title: 'Pending Reports', 
    value: computed(() => reportStore.pendingReportsCount), 
    change: computed(() => reportStore.pendingReportsCount > 0 ? '+' + reportStore.pendingReportsCount : '0'), 
    icon: 'flag',
    bgGradient: 'from-yellow-500/10 to-yellow-600/20',
    textColor: 'text-yellow-600'
  }
]

// Recent users (top 5)
const recentUsers = computed(() => {
  return userStore.adminUsers
    .slice(0, 5)
    .map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      date: new Date().toLocaleDateString(), // Fallback since we don't have joinDate in the User type
      role: user.role
    }))
})

// Recent activities (using reports and user data)
const recentActivities = computed(() => {
  const reportActivities = reportStore.reports
    .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime())
    .slice(0, 3)
    .map(report => ({
      id: `report-${report.id}`,
      user: report.reporterName,
      action: `reported ${report.targetName} for ${report.reason}`,
      time: new Date(report.dateSubmitted).toLocaleDateString(),
      type: 'report'
    }))

  const userActivities = userStore.adminUsers
    .slice(0, 2)
    .map(user => ({
      id: `user-${user.id}`,
      user: `${user.firstName} ${user.lastName}`,
      action: 'joined the platform',
      time: new Date().toLocaleDateString(),
      type: 'user'
    }))

  return [...reportActivities, ...userActivities]
    .slice(0, 5)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 -z-10"></div>
    
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div class="animate-on-scroll opacity-0 translate-y-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin Dashboard</h1>
        <p class="text-text-secondary mt-2">Welcome to the DevMatch admin dashboard.</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-on-scroll opacity-0 translate-y-8">
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
              <p class="text-2xl font-semibold text-text-primary mt-1">
                {{ typeof stat.value === 'object' && stat.value.value !== undefined ? stat.value.value : stat.value }}
              </p>
            </div>
            <div :class="`p-3 rounded-full bg-gradient-to-br ${stat.bgGradient} ${stat.textColor}`">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="stat.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                <path v-if="stat.icon === 'code'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                <path v-if="stat.icon === 'user-check'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                <path v-if="stat.icon === 'flag'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
          </div>
          <div class="mt-2">
            <span
              :class="stat.change && typeof stat.change === 'string' && stat.change.startsWith('+') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'"
              class="text-xs font-medium px-2 py-0.5 rounded"
            >
              {{ typeof stat.change === 'object' && stat.change.value !== undefined ? stat.change.value : stat.change }} from last month
            </span>
          </div>
        </div>
      </div>

      <!-- Chart Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-8">
        <!-- User Role Distribution -->
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <h2 class="text-lg font-semibold text-text-primary mb-4">User Distribution</h2>
          <div v-if="userStore.adminUsers.length > 0" class="h-64">
            <UserRoleDistributionChart :users="userStore.adminUsers" />
          </div>
          <div v-else class="h-64 flex items-center justify-center">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="text-gray-500 text-sm">No user data available</p>
            </div>
          </div>
        </div>

        <!-- User Growth Timeline -->
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <h2 class="text-lg font-semibold text-text-primary mb-4">User Growth</h2>
          <div v-if="userStore.adminUsers.length > 0" class="h-64">
            <UserGrowthChart :users="userStore.adminUsers" />
          </div>
          <div v-else class="h-64 flex items-center justify-center">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p class="text-gray-500 text-sm">No growth data available</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-8">
        <!-- Report Status -->
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <h2 class="text-lg font-semibold text-text-primary mb-4">Report Status</h2>
          <div v-if="reportStore.reports.length > 0" class="h-64">
            <ReportStatusChart
              :pending-count="reportStore.pendingReportsCount"
              :investigating-count="0"
              :resolved-count="reportStore.resolvedReportsCount"
            />
          </div>
          <div v-else class="h-64 flex items-center justify-center">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-gray-500 text-sm">No report data available</p>
            </div>
          </div>
        </div>

        <!-- Top Skills -->
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <h2 class="text-lg font-semibold text-text-primary mb-4">Top Developer Skills</h2>
          <div v-if="userStore.adminUsers.length > 0" class="h-64">
            <SkillsAnalysisChart :users="userStore.adminUsers" />
          </div>
          <div v-else class="h-64 flex items-center justify-center">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-500 text-sm">No skills data available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-8">
        <!-- Recent Users -->
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-text-primary">Recent Users</h2>
            <button class="text-sm text-primary hover:text-primary/80 transition-colors">View All</button>
          </div>
          <div v-if="recentUsers.length > 0" class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200/70">
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200/70">
                <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-primary/5 transition-colors">
                  <td class="px-3 py-3 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-text-primary">{{ user.name }}</div>
                      <div class="text-xs text-text-secondary">{{ user.email }}</div>
                    </div>
                  </td>
                  <td class="px-3 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full capitalize" 
                      :class="{
                        'bg-primary/10 text-primary': user.role === 'admin',
                        'bg-secondary/10 text-secondary': user.role === 'developer' || user.role === 'user'
                      }">
                      {{ user.role === 'user' ? 'Developer' : user.role }}
                    </span>
                  </td>
                  <td class="px-3 py-3 whitespace-nowrap text-sm text-text-secondary hidden md:table-cell">{{ user.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex items-center justify-center py-8">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-gray-500 text-sm">No recent users available</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-text-primary">Recent Activity</h2>
            <button class="text-sm text-primary hover:text-primary/80 transition-colors">View All</button>
          </div>
          <div v-if="recentActivities.length > 0" class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3 py-2 border-b border-gray-100/70 last:border-0"
            >
              <div 
                class="p-2 rounded-full mt-0.5"
                :class="{
                  'bg-primary/10 text-primary': activity.type === 'user',
                  'bg-yellow-100 text-yellow-800': activity.type === 'report'
                }"
              >
                <svg v-if="activity.type === 'user'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-text-primary">
                  <span class="font-semibold">{{ activity.user }}</span>
                  {{ activity.action }}
                </p>
                <p class="text-xs text-text-secondary mt-0.5">{{ activity.time }}</p>
              </div>
            </div>
          </div>
          <div v-else class="flex items-center justify-center py-8">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-500 text-sm">No recent activity available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-on-scroll {
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: calc(var(--delay, 0) * 0.1s);
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
