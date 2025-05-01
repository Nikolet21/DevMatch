import { defineStore } from 'pinia'
import { useNotificationStore } from './notificationStore'
import { mockReports } from '@/data/mockData'
import type { Report } from '@/interfaces/interfaces'

interface ReportForm {
  type: string
  targetId: string | number
  category: string
  subcategory: string
  description: string
  evidence: File | null
  contactInfo?: string
}

interface ValidationErrors {
  category?: string
  subcategory?: string
  description?: string
  evidence?: string
  contactInfo?: string
}

interface ReportCategory {
  label: string
  value: string
  subcategories: { label: string; value: string }[]
}

const userReportCategories: ReportCategory[] = [
  {
    label: 'Harassment',
    value: 'harassment',
    subcategories: [
      { label: 'Bullying', value: 'bullying' },
      { label: 'Hate Speech', value: 'hate_speech' },
      { label: 'Threats', value: 'threats' },
      { label: 'Stalking', value: 'stalking' }
    ]
  },
  {
    label: 'Impersonation',
    value: 'impersonation',
    subcategories: [
      { label: 'Fake Profile', value: 'fake_profile' },
      { label: 'Identity Theft', value: 'identity_theft' },
      { label: 'Misleading Information', value: 'misleading_info' }
    ]
  },
  {
    label: 'Inappropriate Behavior',
    value: 'inappropriate',
    subcategories: [
      { label: 'Spam', value: 'spam' },
      { label: 'Scam', value: 'scam' },
      { label: 'Offensive Language', value: 'offensive_language' }
    ]
  }
]

const contentReportCategories: ReportCategory[] = [
  {
    label: 'Inappropriate Content',
    value: 'inappropriate_content',
    subcategories: [
      { label: 'Adult Content', value: 'adult' },
      { label: 'Violence', value: 'violence' },
      { label: 'Hate Speech', value: 'hate_speech' },
      { label: 'Disturbing Content', value: 'disturbing' }
    ]
  },
  {
    label: 'Copyright Violation',
    value: 'copyright',
    subcategories: [
      { label: 'Stolen Content', value: 'stolen' },
      { label: 'Unauthorized Use', value: 'unauthorized' },
      { label: 'Trademark Violation', value: 'trademark' }
    ]
  },
  {
    label: 'Misinformation',
    value: 'misinformation',
    subcategories: [
      { label: 'Fake News', value: 'fake_news' },
      { label: 'Misleading Content', value: 'misleading' },
      { label: 'False Information', value: 'false_info' }
    ]
  }
]

export const useReportStore = defineStore('report', {
  state: () => ({
    form: {
      type: 'user',
      targetId: '',
      category: '',
      subcategory: '',
      description: '',
      evidence: null,
      contactInfo: ''
    } as ReportForm,
    categories: [] as ReportCategory[],
    isSubmitting: false,
    error: null as string | null,
    validationErrors: {} as ValidationErrors,
    // Admin reports functionality
    reports: [] as Report[],
    selectedReport: null as Report | null,
    isLoading: false,
    statusFilter: 'all',
    priorityFilter: 'all'
  }),

  getters: {
    // Admin reports functionality
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
    setTargetId(id: string | number) {
      this.form.targetId = id
    },

    setType(type: string) {
      this.form.type = type
      this.categories = type === 'user' ? userReportCategories : contentReportCategories
    },

    validateForm(): boolean {
      this.validationErrors = {}
      let isValid = true

      if (!this.form.category) {
        this.validationErrors.category = 'Please select a category'
        isValid = false
      }

      if (!this.form.subcategory && this.form.category) {
        this.validationErrors.subcategory = 'Please select a subcategory'
        isValid = false
      }

      if (!this.form.description.trim()) {
        this.validationErrors.description = 'Please provide a description'
        isValid = false
      } else if (this.form.description.trim().length < 10) {
        this.validationErrors.description = 'Description must be at least 10 characters long'
        isValid = false
      }

      if (this.form.evidence && this.form.evidence.size > 5 * 1024 * 1024) {
        this.validationErrors.evidence = 'File size must not exceed 5MB'
        isValid = false
      }

      if (this.form.contactInfo && this.form.contactInfo.length > 200) {
        this.validationErrors.contactInfo = 'Contact information must not exceed 200 characters'
        isValid = false
      }

      return isValid
    },

    async submitReport() {
      try {
        if (!this.validateForm()) {
          return false
        }

        this.isSubmitting = true
        this.error = null

        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Add notification for report submission
        const notificationStore = useNotificationStore()
        const reportType = this.form.type === 'user' ? 'User' : 'Content'
        notificationStore.success(
          `${reportType} Reported`,
          `Your report has been submitted successfully and will be reviewed by our team.`,
          '/home'
        )

        // Reset form after successful submission
        this.form = {
          type: 'user',
          targetId: '',
          category: '',
          subcategory: '',
          description: '',
          evidence: null,
          contactInfo: ''
        }
        this.validationErrors = {}

        return true
      } catch (e) {
        const notificationStore = useNotificationStore()
        notificationStore.error(
          'Report Failed',
          'Failed to submit report. Please try again later.'
        )
        this.error = 'Failed to submit report. Please try again.'
        return false
      } finally {
        this.isSubmitting = false
      }
    },

    getReportTitle(): string {
      switch (this.form.type) {
        case 'user':
          return 'Report User'
        case 'content':
          return 'Report Content'
        case 'bug':
          return 'Report Bug'
        default:
          return 'Submit Report'
      }
    },

    // Admin reports functionality
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
