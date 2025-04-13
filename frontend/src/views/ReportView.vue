<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface ReportForm {
  type: string
  targetId: string | number
  reason: string
  description: string
  evidence: string
}


const reportForm = ref<ReportForm>({
  type: 'user',
  targetId: route.params.id as string,
  reason: '',
  description: '',
  evidence: ''
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const getReportTitle = () => {
  switch (reportForm.value.type) {
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

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    error.value = null

    await new Promise(resolve => setTimeout(resolve, 1000))

    router.push('/home')
  } catch (e) {
    error.value = 'Failed to submit report. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-500 to-purple-100 py-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Return Button -->
      <button
        @click="goBack"
        class="mb-8 inline-flex items-center px-4 py-2 bg-white/90 text-indigo-600 rounded-lg hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>

      <!-- Report Form -->
      <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ getReportTitle() }}</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Reason Field -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">Reason for Report</label>
            <select
              id="reason"
              v-model="reportForm.reason"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="" disabled>Select a reason</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="fake">Fake Profile/Content</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Description Field -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              v-model="reportForm.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please provide detailed information about the issue..."
              required
            ></textarea>
          </div>

          <!-- Evidence Field -->
          <div>
            <label for="evidence" class="block text-sm font-medium text-gray-700 mb-2">Evidence (Optional)</label>
            <textarea
              id="evidence"
              v-model="reportForm.evidence"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Provide any links or additional information that supports your report..."
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
