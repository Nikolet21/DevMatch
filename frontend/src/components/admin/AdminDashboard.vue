<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAdminUserStore } from '@/stores/adminUserStore'
import { useAdminReportStore } from '@/stores/adminReportStore'
import { useMatchStore } from '@/stores/matchStore'

// Import chart components
import UserRoleDistributionChart from './charts/UserRoleDistributionChart.vue'
import UserGrowthChart from './charts/UserGrowthChart.vue'
import ReportStatusChart from './charts/ReportStatusChart.vue'
import SkillsAnalysisChart from './charts/SkillsAnalysisChart.vue'

// Initialize stores
const adminUserStore = useAdminUserStore()
const adminReportStore = useAdminReportStore()
const matchStore = useMatchStore()

// Load data
onMounted(async () => {
  await adminUserStore.initializeUsers()
  await adminReportStore.fetchReports()
  await matchStore.fetchMatches()
})

const stats = [
  { id: 1, title: 'Total Users', value: computed(() => adminUserStore.users.length), change: '+12%', icon: 'users' },
  { id: 2, title: 'Active Developers', value: computed(() => adminUserStore.users.filter(u => u.role === 'developer' && u.status === 'Active').length), change: '+7%', icon: 'code' },
  { id: 3, title: 'Matched Teams', value: computed(() => matchStore.matches.filter(m => m.status === 'accepted').length), change: '+18%', icon: 'user-check' },
  { id: 4, title: 'Open Reports', value: computed(() => adminReportStore.pendingReportsCount + adminReportStore.investigatingReportsCount), change: computed(() => adminReportStore.pendingReportsCount > 0 ? '+' + adminReportStore.pendingReportsCount : '0'), icon: 'flag' }
]

// Recent users (top 5)
const recentUsers = computed(() => {
  return adminUserStore.users
    .sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime())
    .slice(0, 5)
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      date: user.joinDate.toLocaleDateString(),
      role: user.role
    }))
})

// Recent activities (using reports and user data)
const recentActivities = computed(() => {
  const reportActivities = adminReportStore.reports
    .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime())
    .slice(0, 3)
    .map(report => ({
      id: `report-${report.id}`,
      user: report.reporterName,
      action: `reported ${report.targetName} for ${report.reason}`,
      time: new Date(report.dateSubmitted).toLocaleDateString()
    }))

  const userActivities = adminUserStore.users
    .sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime())
    .slice(0, 2)
    .map(user => ({
      id: `user-${user.id}`,
      user: user.name,
      action: 'joined the platform',
      time: user.joinDate.toLocaleDateString()
    }))

  return [...reportActivities, ...userActivities]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5)
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Welcome to the DevMatch admin dashboard.</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
            <p class="text-2xl font-semibold text-gray-900 mt-1">
              {{ typeof stat.value === 'object' && stat.value.value !== undefined ? stat.value.value : stat.value }}
            </p>
          </div>
          <div class="p-3 rounded-full bg-primary/10 text-primary">
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- User Role Distribution -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
        <UserRoleDistributionChart :users="adminUserStore.users" />
      </div>

      <!-- User Growth Timeline -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
        <UserGrowthChart :users="adminUserStore.users" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Report Status -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Report Status</h2>
        <ReportStatusChart
          :pending-count="adminReportStore.pendingReportsCount"
          :investigating-count="adminReportStore.investigatingReportsCount"
          :resolved-count="adminReportStore.resolvedReportsCount"
        />
      </div>

      <!-- Top Skills -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Developer Skills</h2>
        <SkillsAnalysisChart :users="adminUserStore.users" />
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Recent Users</h2>
          <button class="text-sm text-primary hover:text-primary/80 transition-colors">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-3 py-3 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-xs text-gray-500">{{ user.email }}</div>
                  </div>
                </td>
                <td class="px-3 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{{ user.role }}</span>
                </td>
                <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{{ user.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button class="text-sm text-primary hover:text-primary/80 transition-colors">View All</button>
        </div>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-0"
          >
            <div class="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                <span class="font-semibold">{{ activity.user }}</span>
                {{ activity.action }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
