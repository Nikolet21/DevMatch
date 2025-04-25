import { defineStore } from 'pinia'
import { mockReports, type Report } from '@/data/mockData'

export type { Report }

export const useAdminReportStore = defineStore('adminReport', {
  state: () => ({
    reports: [] as Report[],
    selectedReport: null as Report | null,
    isLoading: false,
    statusFilter: 'all',
    priorityFilter: 'all'
  }),

  getters: {
    filteredReports: (state) => {
      return state.reports.filter(report => {
        const matchesStatus = state.statusFilter === 'all' || report.status === state.statusFilter
        const matchesPriority = state.priorityFilter === 'all' || report.priority === state.priorityFilter
        return matchesStatus && matchesPriority
      })
    },
    pendingReportsCount: (state) => {
      return state.reports.filter(report => report.status === 'pending').length
    },
    resolvedReportsCount: (state) => {
      return state.reports.filter(report => report.status === 'resolved').length
    },
    investigatingReportsCount: (state) => {
      return state.reports.filter(report => report.status === 'investigating').length
    }
  },

  actions: {
    selectReport(report: Report) {
      this.selectedReport = report
    },
    clearSelectedReport() {
      this.selectedReport = null
    },
    updateReportStatus(reportId: number, newStatus: 'pending' | 'investigating' | 'resolved', resolution: string = '') {
      const report = this.reports.find(r => r.id === reportId)
      if (report) {
        report.status = newStatus
        if (newStatus === 'resolved') {
          report.resolvedDate = new Date()
          report.resolution = resolution
        }
      }
    },
    setStatusFilter(status: string) {
      this.statusFilter = status
    },
    setPriorityFilter(priority: string) {
      this.priorityFilter = priority
    },
    fetchReports() {
      // In a real app, this would be an API call
      this.isLoading = true

      // Load reports from mock data
      setTimeout(() => {
        this.reports = mockReports
        this.isLoading = false
      }, 500)
    }
  }
})