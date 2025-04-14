import { defineStore } from 'pinia'

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
    validationErrors: {} as ValidationErrors
  }),

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
    }
  }
})
