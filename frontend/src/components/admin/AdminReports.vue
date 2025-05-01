<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import type { Report } from '@/interfaces/interfaces'

// Use the Pinia store
const reportStore = useReportStore()

// Use the modal state locally
const showReportDetails = ref(false)

// Methods
const viewReportDetails = (report: Report) => {
  reportStore.selectReport(report)
  showReportDetails.value = true
}

const closeReportDetails = () => {
  showReportDetails.value = false
  setTimeout(() => {
    reportStore.clearSelectedReport()
  }, 200)
}

const updateReportStatus = (reportId: number, newStatus: 'pending' | 'investigating' | 'resolved', resolution = '') => {
  reportStore.updateReportStatus(reportId, newStatus, resolution)

  // Close the modal after updating
  if (showReportDetails.value) {
    closeReportDetails()
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'investigating':
      return 'bg-blue-100 text-blue-800'
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
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Report Management</h1>
      <p class="text-gray-600 mt-1">Review and manage user reports.</p>
    </div>

    <!-- Report Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Pending Reports</p>
            <p class="text-2xl font-semibold text-gray-900">{{ reportStore.pendingReportsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="p-3 rounded-full bg-blue-100 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Investigating</p>
            <p class="text-2xl font-semibold text-gray-900">{{ reportStore.investigatingReportsCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <div class="flex items-center space-x-3">
          <div class="p-3 rounded-full bg-green-100 text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Resolved Reports</p>
            <p class="text-2xl font-semibold text-gray-900">{{ reportStore.resolvedReportsCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div class="text-base font-medium text-gray-900">Filter Reports</div>
        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <select
            v-model="reportStore.statusFilter"
            class="rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            v-model="reportStore.priorityFilter"
            class="rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="report in reportStore.filteredReports" :key="report.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ report.reporterName }}</div>
                    <div class="text-xs text-gray-500">Target: {{ report.targetName }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ report.reason }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(report.status)">
                  {{ report.status.charAt(0).toUpperCase() + report.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(report.priority)">
                  {{ report.priority.charAt(0).toUpperCase() + report.priority.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(report.dateSubmitted).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewReportDetails(report)"
                  class="text-primary hover:text-primary/80 transition-colors"
                >
                  View Details
                </button>
              </td>
            </tr>

            <!-- Empty state when no reports match filters -->
            <tr v-if="reportStore.filteredReports.length === 0">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-gray-600 font-medium">No reports found</p>
                  <p class="text-gray-500 text-sm mt-1">Try adjusting your filter criteria</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Report Details Modal -->
    <div v-if="showReportDetails" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeReportDetails"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Report Details
                </h3>

                <div v-if="reportStore.selectedReport" class="space-y-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-500">Status</span>
                      <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(reportStore.selectedReport.status)">
                        {{ reportStore.selectedReport.status.charAt(0).toUpperCase() + reportStore.selectedReport.status.slice(1) }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-500">Priority</span>
                      <span class="px-2 py-1 text-xs rounded-full" :class="getPriorityClass(reportStore.selectedReport.priority)">
                        {{ reportStore.selectedReport.priority.charAt(0).toUpperCase() + reportStore.selectedReport.priority.slice(1) }}
                      </span>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-4">
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Reporter</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ reportStore.selectedReport.reporterName }}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Reported User</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ reportStore.selectedReport.targetName }}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Reason</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ reportStore.selectedReport.reason }}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Date Submitted</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ new Date(reportStore.selectedReport.dateSubmitted).toLocaleDateString() }}</dd>
                      </div>
                      <div v-if="reportStore.selectedReport.resolvedDate" class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Date Resolved</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ new Date(reportStore.selectedReport.resolvedDate).toLocaleDateString() }}</dd>
                      </div>
                      <div class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500">Description</dt>
                        <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ reportStore.selectedReport.description }}</dd>
                      </div>
                      <div v-if="reportStore.selectedReport.resolution" class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500">Resolution</dt>
                        <dd class="mt-1 text-sm text-gray-900 whitespace-pre-line">{{ reportStore.selectedReport.resolution }}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse space-x-3 space-x-reverse">
            <button
              v-if="reportStore.selectedReport && reportStore.selectedReport.status !== 'resolved'"
              @click="updateReportStatus(reportStore.selectedReport.id, 'resolved', 'Issue resolved after review.')"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Mark as Resolved
            </button>
            <button
              v-if="reportStore.selectedReport && reportStore.selectedReport.status === 'pending'"
              @click="updateReportStatus(reportStore.selectedReport.id, 'investigating')"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Investigate
            </button>
            <button
              @click="closeReportDetails"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
