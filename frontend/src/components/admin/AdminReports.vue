<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import { useUserStore } from '@/stores/userStore'
import type { Report } from '@/interfaces/interfaces'

// Lazy-loaded component
const ReportDetailsModal = defineAsyncComponent(() => 
  import('@/components/modals/ReportDetailsModal.vue')
)

// Use the Pinia stores
const reportStore = useReportStore()
const userStore = useUserStore()

// Modal state
const showReportDetails = ref(false)
const animatedElements = ref<HTMLElement[]>([])

// Methods
const viewReportDetails = (report: Report) => {
  reportStore.selectReport(report)
  showReportDetails.value = true
  
  // Make sure we have user data loaded for the report details
  if (!userStore.adminUsers || userStore.adminUsers.length === 0) {
    userStore.fetchAllUsers()
  }
}

const closeReportDetails = () => {
  showReportDetails.value = false
  setTimeout(() => {
    reportStore.clearSelectedReport()
  }, 200)
}

const handleApproveReport = (reportId: number, action: string, resolution: string) => {
  reportStore.approveReport(reportId, action, resolution)
  closeReportDetails()
}

const handleDenyReport = (reportId: number, resolution: string) => {
  reportStore.denyReport(reportId, resolution)
  closeReportDetails()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-orange-100 text-orange-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

onMounted(() => {
  reportStore.fetchReports()
  
  // Animation setup
  animatedElements.value = Array.from(document.querySelectorAll('.animate-on-scroll'))
  
  // Initial check for elements in viewport
  setTimeout(() => {
    animatedElements.value.forEach(element => {
      element.classList.add('visible')
    })
  }, 100)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 -z-10"></div>
    
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <!-- Page Header -->
      <div class="animate-on-scroll opacity-0 translate-y-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Report Management
        </h1>
        <p class="text-text-secondary mt-2">Review and manage reported users and content</p>
      </div>
      
      <!-- Filters -->
      <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 mt-6 animate-on-scroll opacity-0 translate-y-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 class="text-base font-semibold text-text-primary">Filter Reports</h3>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <select
              v-model="reportStore.statusFilter"
              class="rounded-lg bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 text-text-primary py-3 px-4 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              v-model="reportStore.priorityFilter"
              class="rounded-lg bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 text-text-primary py-3 px-4 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
  
            <button 
              class="flex items-center justify-center gap-2 rounded-full bg-white/70 px-5 py-3 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/10 hover:bg-white transition-all duration-200 hover:shadow-md"
              @click="reportStore.resetFilters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Report Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-8">
        <div class="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text-primary">Pending Reports</h3>
              <div class="flex items-center mt-1">
                <span class="text-3xl font-bold text-primary">{{ reportStore.pendingReportsCount }}</span>
                <span class="ml-2 text-sm text-text-secondary">Need review</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text-primary">Resolved Reports</h3>
              <div class="flex items-center mt-1">
                <span class="text-3xl font-bold text-primary">{{ reportStore.resolvedReportsCount }}</span>
                <span class="ml-2 text-sm text-text-secondary">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden animate-on-scroll opacity-0 translate-y-8">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200/70">
            <thead class="bg-gray-50/70">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white/20 divide-y divide-gray-200/70">
              <tr v-for="report in reportStore.filteredReports" :key="report.id" class="hover:bg-primary/5 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-sm">
                      <span class="text-primary text-sm font-medium">
                        {{ report.reporterName.charAt(0) }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-text-primary">{{ report.reporterName }}</div>
                      <div class="text-xs text-text-secondary">Target: {{ report.targetName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-text-primary">{{ report.reason }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-medium rounded-full" :class="getStatusClass(report.status)">
                    {{ report.status.charAt(0).toUpperCase() + report.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-medium rounded-full" :class="getPriorityClass(report.priority)">
                    {{ report.priority.charAt(0).toUpperCase() + report.priority.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                  {{ new Date(report.dateSubmitted).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewReportDetails(report)"
                    class="text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded-lg hover:bg-primary/5"
                  >
                    View
                  </button>
                </td>
              </tr>

              <!-- Empty state when no reports match filters -->
              <tr v-if="reportStore.filteredReports.length === 0">
                <td colspan="6" class="px-6 py-10 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-gray-700 font-medium">No reports found</p>
                    <p class="text-gray-500 text-sm mt-1 max-w-md">Try adjusting your filter criteria</p>
                    <button
                      @click="reportStore.resetFilters"
                      class="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
                    >
                      Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Report Details Modal (lazy loaded) -->
      <ReportDetailsModal
        :is-open="showReportDetails"
        :report="reportStore.selectedReport"
        @close="closeReportDetails"
        @approve="handleApproveReport"
        @deny="handleDenyReport"
      />
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
