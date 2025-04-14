<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useReportStore } from '../stores/reportStore'

const router = useRouter()
const route = useRoute()
const reportStore = useReportStore()

// Initialize store with route params and determine report type
const targetId = route.params.targetId as string
if (!targetId) {
  router.push('/home')
} else {
  reportStore.setTargetId(targetId)

  // Determine report type from URL
  if (targetId.includes('_album_')) {
    reportStore.setType('content')
  } else {
    reportStore.setType('user')
  }
}

const handleSubmit = async () => {
  const success = await reportStore.submitReport()
  if (success) {
    router.push('/home')
  }
}

const goBack = () => {
  router.back()
}

const handleFileChange = (event: Event) => {
  reportStore.form.evidence = (event.target as HTMLInputElement)?.files?.[0] || null
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
        <h1 class="text-3xl font-bold text-gray-900 mb-8">{{ reportStore.getReportTitle() }}</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Category Field -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              id="category"
              v-model="reportStore.form.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select a category</option>
              <option v-for="category in reportStore.categories" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>

          <!-- Subcategory Field -->
          <div v-if="reportStore.form.category">
            <label for="subcategory" class="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
            <select
              id="subcategory"
              v-model="reportStore.form.subcategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select a subcategory</option>
              <option
                v-for="subcategory in reportStore.categories.find(c => c.value === reportStore.form.category)?.subcategories"
                :key="subcategory.value"
                :value="subcategory.value"
              >
                {{ subcategory.label }}
              </option>
            </select>
          </div>



          <!-- Description Field -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              v-model="reportStore.form.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Please provide detailed information about the issue..."
            ></textarea>
            <span v-if="reportStore.validationErrors.description" class="text-red-500 text-sm mt-1">
              {{ reportStore.validationErrors.description }}
            </span>
          </div>

          <!-- Evidence Field -->
          <div>
            <label for="evidence" class="block text-sm font-medium text-gray-700 mb-2">Screenshot Evidence (Optional)</label>
            <div class="relative">
              <input
                type="file"
                id="evidence"
                @change="handleFileChange"
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div class="w-full px-4 py-3 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200 flex items-center justify-center gap-2">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-indigo-600 font-medium">Choose a file</span>
              </div>
            </div>
          </div>

          <!-- Contact Information Field -->
          <div>
            <label for="contactInfo" class="block text-sm font-medium text-gray-700 mb-2">Contact Information (Optional)</label>
            <input
              type="text"
              id="contactInfo"
              v-model="reportStore.form.contactInfo"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="How can we contact you for additional information if needed?"
            />
          </div>

          <!-- Validation Error Messages -->
          <div v-if="reportStore.validationErrors.category" class="text-red-500 text-sm mb-2">
            {{ reportStore.validationErrors.category }}
          </div>
          <div v-if="reportStore.validationErrors.subcategory" class="text-red-500 text-sm mb-2">
            {{ reportStore.validationErrors.subcategory }}
          </div>
          <div v-if="reportStore.validationErrors.evidence" class="text-red-500 text-sm mb-2">
            {{ reportStore.validationErrors.evidence }}
          </div>
          <div v-if="reportStore.validationErrors.contactInfo" class="text-red-500 text-sm mb-2">
            {{ reportStore.validationErrors.contactInfo }}
          </div>
          <!-- Error Message -->
          <div v-if="reportStore.error" class="text-red-600 text-sm mb-2">{{ reportStore.error }}</div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="reportStore.isSubmitting"
            class="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ reportStore.isSubmitting ? 'Submitting...' : 'Submit Report' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
