<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingStore, type SettingsError } from '@/stores/settingStore'
import { useActivityStore } from '@/stores/activityStore'
import { useActivityLogger } from '@/composables/useActivityLogger'
import { validateSettingsPasswordForm, validateSettingsEmailForm, type SettingsFormErrors } from '@/utils/validation'
import { getActivityIcon, getActivityColor, formatActivityDate } from '@/utils/activityUtils'

const DeleteAccountModal = defineAsyncComponent(() =>
  import('@/components/modals/DeleteAccountModal.vue')
)

const router = useRouter()
const settingStore = useSettingStore()
const activityStore = useActivityStore()
const { logPasswordChanged, logEmailChanged, logMfaEnabled, logMfaDisabled } = useActivityLogger()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const email = ref('')
const newEmail = ref('')
const confirmEmail = ref('')
const deleteConfirmation = ref('')
const confirmDeletePhrase = 'DELETE'
const showDeleteConfirmModal = ref(false)
const mfaEnabled = ref(false)

// Replace the mock activity log with the store data
const searchQuery = ref('')
const selectedCategory = ref('All')
const categoryOptions = computed(() => ['All', ...activityStore.availableCategories.filter(cat => cat !== 'All')])

// Load activity logs on component mount
onMounted(() => {
  activityStore.loadActivityLogs()
})

// Update pagination methods to use the store
const goToPage = (page: number) => {
  activityStore.goToPage(page)
}

const prevPage = () => {
  activityStore.previousPage()
}

const nextPage = () => {
  activityStore.nextPage()
}

// Computed values from the store
const currentPage = computed(() => activityStore.pagination.currentPage)
const itemsPerPage = computed(() => activityStore.pagination.itemsPerPage)
const filteredActivityLog = computed(() => activityStore.filteredActivityLogs)
const paginatedActivityLog = computed(() => activityStore.paginatedActivityLogs)
const totalPages = computed(() => activityStore.totalPages)

// Update the search and filter functions
const updateFilter = () => {
  activityStore.updateFilter(selectedCategory.value as any, searchQuery.value)
}

// Explicitly refresh the activity logs
const refreshActivityLogs = () => {
  activityStore.loadActivityLogs()
}

// Watch for changes to search or category and update filters
watch([searchQuery, selectedCategory], () => {
  updateFilter()
})

const formErrors = reactive<SettingsFormErrors>({})

const isLoading = computed(() => settingStore.isLoading)
const errors = computed<SettingsError>(() => settingStore.errors)
const successMessage = computed(() => settingStore.successMessage)
const activeTab = ref('security')

// Refresh activity logs when switching to the activity tab
watch(activeTab, (newTab) => {
  if (newTab === 'activity') {
    activityStore.loadActivityLogs()
  }
})

const validatePasswordForm = (): boolean => {
  const validationErrors = validateSettingsPasswordForm(
    currentPassword.value,
    newPassword.value,
    confirmPassword.value
  )
  Object.assign(formErrors, validationErrors)
  return Object.keys(validationErrors).length === 0
}

const validateEmailForm = (): boolean => {
  const validationErrors = validateSettingsEmailForm(
    email.value,
    newEmail.value,
    confirmEmail.value
  )
  Object.assign(formErrors, validationErrors)
  return Object.keys(validationErrors).length === 0
}

const goToHome = () => {
  router.push('/home')
}

const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return

  settingStore.clearMessages()
  await settingStore.updatePassword(
    currentPassword.value,
    newPassword.value,
    confirmPassword.value
  )

  if (!errors.value.password && !errors.value.general) {
    // Log the password change with timestamp and security info
    logPasswordChanged({
      securityInfo: 'Password changed through account settings',
      timestamp: new Date().toISOString()
    })

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  }
}

const handleEmailChange = async () => {
  if (!validateEmailForm()) return

  settingStore.clearMessages()
  await settingStore.updateEmail(
    email.value,
    newEmail.value,
    confirmEmail.value
  )

  if (!errors.value.email && !errors.value.general) {
    // Log the email change with additional details
    logEmailChanged(newEmail.value, {
      previousEmail: email.value,
      securityInfo: 'Email address updated through account settings',
      timestamp: new Date().toISOString()
    })

    email.value = ''
    newEmail.value = ''
    confirmEmail.value = ''
  }
}

const toggleMfa = () => {
  mfaEnabled.value = !mfaEnabled.value
  // Log the MFA toggle with additional security information
  if (mfaEnabled.value) {
    logMfaEnabled({
      securityInfo: 'Two-factor authentication enabled for account',
      timestamp: new Date().toISOString()
    })
  } else {
    logMfaDisabled({
      securityInfo: 'Two-factor authentication disabled for account',
      timestamp: new Date().toISOString()
    })
  }
  // In a real application, this would trigger MFA setup/disable process
}

const openDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = true
}

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false
  deleteConfirmation.value = ''
}

const handleDeleteAccount = () => {
  if (deleteConfirmation.value === confirmDeletePhrase) {
    // In a real application, this would trigger account deletion process
    alert('Account scheduled for deletion. You will be logged out.')
    router.push('/login')
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<template>
  <div class="min-h-screen bg-background py-8 sm:py-12 md:py-16">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Responsive Header with Return Button -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
      <button
        @click="goToHome"
          class="inline-flex items-center px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200 w-full sm:w-auto"
        >
          <font-awesome-icon icon="arrow-left" class="mr-2" />
          Back to Home
      </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-text-primary text-center">Account Settings</h1>
        <div class="w-full sm:w-32"></div> <!-- Empty div for flex spacing -->
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Responsive Tabs -->
        <div class="bg-gray-50 border-b border-gray-200 overflow-x-auto">
          <div class="flex flex-wrap">
            <button
              @click="activeTab = 'security'"
              class="px-4 sm:px-6 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap"
              :class="activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <font-awesome-icon icon="user-check" class="mr-2" />
              <span>Security</span>
            </button>
            <button
              @click="activeTab = 'mfa'"
              class="px-4 sm:px-6 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap"
              :class="activeTab === 'mfa' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <font-awesome-icon icon="check-double" class="mr-2" />
              <span class="hidden xs:inline">Multi-Factor</span>
              <span class="inline xs:hidden">MFA</span>
            </button>
            <button
              @click="activeTab = 'activity'; refreshActivityLogs()"
              class="px-4 sm:px-6 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap"
              :class="activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <font-awesome-icon icon="bolt" class="mr-2" />
              <span>Activity Log</span>
            </button>
            <button
              @click="activeTab = 'danger'"
              class="px-4 sm:px-6 py-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap"
              :class="activeTab === 'danger' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-red-500 hover:border-red-300'"
            >
              <font-awesome-icon icon="trash-alt" class="mr-2" />
              <span>Danger Zone</span>
            </button>
          </div>
            </div>

        <div class="p-4 sm:p-6">
          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="space-y-6 sm:space-y-8">
            <div>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Security Settings</h2>
              <p class="text-gray-600 mb-6 sm:mb-8">Manage your password and email to keep your account secure</p>

              <!-- Alert Messages -->
              <div v-if="errors.password || errors.email || errors.general"
                class="mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">
                      {{ errors.password || errors.email || errors.general }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-if="!errors.password && !errors.email && !errors.general && successMessage"
                class="mb-6 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <font-awesome-icon icon="check-circle" class="h-5 w-5 text-green-500" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-green-700">{{ successMessage }}</p>
                  </div>
                </div>
              </div>

              <!-- Password Change Section -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 sm:mb-8">
                <div class="bg-gradient-to-r from-primary/10 to-transparent px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div class="flex items-center">
                    <font-awesome-icon icon="lock" class="h-5 w-5 text-primary mr-2 sm:mr-3" />
                    <h3 class="text-base sm:text-lg font-medium text-gray-900">Change Password</h3>
                  </div>
                </div>
                <div class="px-4 sm:px-6 py-4 sm:py-5">
                  <form @submit.prevent="handlePasswordChange" class="space-y-4 sm:space-y-5">
                    <div>
                      <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <div class="relative rounded-md shadow-sm">
              <input
                id="currentPassword"
                v-model="currentPassword"
                type="password"
                :class="{
                            'ring-red-500 border-red-500': formErrors.currentPassword,
                            'focus:ring-primary focus:border-primary': !formErrors.currentPassword
                          }"
                          class="block w-full rounded-md border-gray-300 shadow-sm py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                        />
                        <div v-if="formErrors.currentPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <p v-if="formErrors.currentPassword" class="mt-1 text-sm text-red-600">{{ formErrors.currentPassword }}</p>
            </div>

            <div>
                      <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <div class="relative rounded-md shadow-sm">
              <input
                id="newPassword"
                v-model="newPassword"
                type="password"
                :class="{
                            'ring-red-500 border-red-500': formErrors.newPassword,
                            'focus:ring-primary focus:border-primary': !formErrors.newPassword
                          }"
                          class="block w-full rounded-md border-gray-300 shadow-sm py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                        />
                        <div v-if="formErrors.newPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <p v-if="formErrors.newPassword" class="mt-1 text-sm text-red-600">{{ formErrors.newPassword }}</p>
            </div>

            <div>
                      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <div class="relative rounded-md shadow-sm">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                :class="{
                            'ring-red-500 border-red-500': formErrors.confirmPassword,
                            'focus:ring-primary focus:border-primary': !formErrors.confirmPassword
                          }"
                          class="block w-full rounded-md border-gray-300 shadow-sm py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                        />
                        <div v-if="formErrors.confirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ formErrors.confirmPassword }}</p>
            </div>

                    <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                        class="w-full inline-flex justify-center items-center rounded-md bg-primary px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                        <font-awesome-icon v-if="isLoading" icon="circle-notch" spin class="mr-2" />
                        <font-awesome-icon v-else icon="key" class="mr-2" />
                {{ isLoading ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </form>
                </div>
        </div>

        <!-- Email Change Section -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-primary/10 to-transparent px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div class="flex items-center">
                    <font-awesome-icon icon="envelope" class="h-5 w-5 text-primary mr-2 sm:mr-3" />
                    <h3 class="text-base sm:text-lg font-medium text-gray-900">Change Email</h3>
          </div>
            </div>
                <div class="px-4 sm:px-6 py-4 sm:py-5">
                  <form @submit.prevent="handleEmailChange" class="space-y-4 sm:space-y-5">
            <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Current Email</label>
                      <div class="relative rounded-md shadow-sm">
              <input
                id="email"
                v-model="email"
                          type="email"
                :class="{
                            'ring-red-500 border-red-500': formErrors.currentEmail,
                            'focus:ring-primary focus:border-primary': !formErrors.currentEmail
                          }"
                          class="block w-full rounded-md border-gray-300 shadow-sm py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                        />
                        <div v-if="formErrors.currentEmail" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <p v-if="formErrors.currentEmail" class="mt-1 text-sm text-red-600">{{ formErrors.currentEmail }}</p>
            </div>

            <div>
                      <label for="newEmail" class="block text-sm font-medium text-gray-700 mb-1">New Email</label>
                      <div class="relative rounded-md shadow-sm">
              <input
                id="newEmail"
                v-model="newEmail"
                          type="email"
                :class="{
                            'ring-red-500 border-red-500': formErrors.newEmail,
                            'focus:ring-primary focus:border-primary': !formErrors.newEmail
                          }"
                          class="block w-full rounded-md border-gray-300 shadow-sm py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                        />
                        <div v-if="formErrors.newEmail" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <p v-if="formErrors.newEmail" class="mt-1 text-sm text-red-600">{{ formErrors.newEmail }}</p>
            </div>

            <div>
                      <label for="confirmEmail" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Email</label>
                      <div class="relative rounded-md shadow-sm">
              <input
                id="confirmEmail"
                v-model="confirmEmail"
                          type="email"
                :class="{
                            'ring-red-500 border-red-500': formErrors.confirmEmail,
                            'focus:ring-primary focus:border-primary': !formErrors.confirmEmail
                          }"
                          class="block w-full rounded-md border-gray-300 shadow-sm py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base"
                        />
                        <div v-if="formErrors.confirmEmail" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                        </div>
                      </div>
                      <p v-if="formErrors.confirmEmail" class="mt-1 text-sm text-red-600">{{ formErrors.confirmEmail }}</p>
            </div>

                    <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                        class="w-full inline-flex justify-center items-center rounded-md bg-primary px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                        <font-awesome-icon v-if="isLoading" icon="circle-notch" spin class="mr-2" />
                        <font-awesome-icon v-else icon="envelope" class="mr-2" />
                {{ isLoading ? 'Updating...' : 'Update Email' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

          <!-- Multi-Factor Authentication Tab -->
          <div v-if="activeTab === 'mfa'" class="space-y-4 sm:space-y-6">
            <div>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Multi-Factor Authentication</h2>
              <p class="text-gray-600 mb-4 sm:mb-6">Add an extra layer of security to your account</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ mfaEnabled ? 'Your account is protected with two-factor authentication.' : 'Protect your account with two-factor authentication.' }}
                  </p>
                </div>
                <div class="sm:ml-4">
                  <button
                    @click="toggleMfa"
                    class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                    :class="mfaEnabled ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500' : 'bg-primary text-white hover:bg-primary/90 focus:ring-primary'"
                  >
                    {{ mfaEnabled ? 'Disable 2FA' : 'Enable 2FA' }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="mfaEnabled" class="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
              <h3 class="text-base sm:text-lg font-medium text-gray-900">Recovery Codes</h3>
              <p class="text-sm text-gray-600">
                Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.
              </p>
              <div class="mt-2">
                <button
                  class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <font-awesome-icon icon="download" class="mr-2" />
                  Download Recovery Codes
                </button>
              </div>
            </div>
          </div>

          <!-- Activity Log Tab -->
          <div v-if="activeTab === 'activity'" class="space-y-4 sm:space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Account Activity</h2>
              <button
                @click="refreshActivityLogs()"
                class="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-all duration-200"
              >
                <font-awesome-icon icon="sync" class="mr-1" /> Refresh
              </button>
            </div>
            <p class="text-gray-600 mb-4 sm:mb-6">Review your recent account activity and actions</p>

            <!-- Filters and Search -->
            <div class="bg-white shadow rounded-lg border border-gray-200 p-3 sm:p-4 mb-4">
              <div class="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                <div class="flex-1">
                  <label for="activity-search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <font-awesome-icon icon="search" class="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="activity-search"
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search activities..."
                      class="block w-full rounded-md border-gray-300 pl-10 sm:pl-12 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                <div class="w-full md:w-48">
                  <label for="category-filter" class="block text-sm font-medium text-gray-700 mb-1">Filter by</label>
                  <select
                    id="category-filter"
                    v-model="selectedCategory"
                    class="block w-full rounded-md border-gray-300 py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base focus:border-primary focus:ring-primary"
                  >
                    <option v-for="category in categoryOptions" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Activity Table -->
            <div class="bg-white shadow overflow-hidden border border-gray-200 rounded-lg">
              <!-- Empty state if no activities -->
              <div v-if="filteredActivityLog.length === 0" class="p-4 sm:p-6 text-center">
                <font-awesome-icon icon="inbox" class="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mb-4" />
                <h3 class="text-base sm:text-lg font-medium text-gray-900">No activities found</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ searchQuery ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'No recent activity has been recorded for your account.' }}
                </p>
              </div>

              <!-- Activity table for larger screens -->
              <div class="hidden sm:block">
                <table v-if="filteredActivityLog.length > 0" class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="activity in paginatedActivityLog" :key="activity.id" class="hover:bg-gray-50">
                      <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div class="flex items-start">
                          <div class="mr-3 flex-shrink-0">
                            <font-awesome-icon :icon="getActivityIcon(activity.category)" class="h-5 w-5" :class="getActivityColor(activity.category)" />
                          </div>
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{ activity.action }}</div>
                            <div class="text-sm text-gray-500">{{ activity.description }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="{
                            'bg-blue-100 text-blue-800': activity.category === 'Security',
                            'bg-purple-100 text-purple-800': activity.category === 'Profile',
                            'bg-green-100 text-green-800': activity.category === 'Matches',
                            'bg-orange-100 text-orange-800': activity.category === 'Reports',
                            'bg-red-100 text-red-800': activity.category === 'Privacy'
                          }">
                          {{ activity.category }}
                        </span>
                      </td>
                      <td class="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(activity.timestamp) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Activity cards for mobile -->
              <div class="sm:hidden">
                <ul v-if="filteredActivityLog.length > 0" class="divide-y divide-gray-200">
                  <li v-for="activity in paginatedActivityLog" :key="activity.id" class="p-4 hover:bg-gray-50">
                    <div class="flex items-start mb-2">
                      <div class="mr-3 flex-shrink-0">
                        <font-awesome-icon :icon="getActivityIcon(activity.category)" class="h-5 w-5" :class="getActivityColor(activity.category)" />
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900">{{ activity.action }}</div>
                        <div class="text-sm text-gray-500">{{ activity.description }}</div>
                      </div>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                      <span class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="{
                          'bg-blue-100 text-blue-800': activity.category === 'Security',
                          'bg-purple-100 text-purple-800': activity.category === 'Profile',
                          'bg-green-100 text-green-800': activity.category === 'Matches',
                          'bg-orange-100 text-orange-800': activity.category === 'Reports',
                          'bg-red-100 text-red-800': activity.category === 'Privacy'
                        }">
                        {{ activity.category }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Pagination controls -->
              <div v-if="filteredActivityLog.length > 0" class="px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="hidden sm:block">
                    <p class="text-sm text-gray-700">
                      Showing
                      <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span>
                      to
                      <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredActivityLog.length) }}</span>
                      of
                      <span class="font-medium">{{ filteredActivityLog.length }}</span>
                      results
                    </p>
                  </div>
                  <div class="flex justify-center sm:justify-end">
                    <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span class="sr-only">Previous</span>
                        <font-awesome-icon icon="chevron-left" class="h-4 w-4" />
                      </button>
                      <button
                        v-for="page in totalPages"
                        :key="page"
                        @click="goToPage(page)"
                        :class="[
                          'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                          currentPage === page
                            ? 'z-10 bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        ]"
                      >
                        {{ page }}
                      </button>
                      <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span class="sr-only">Next</span>
                        <font-awesome-icon icon="chevron-right" class="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone Tab -->
          <div v-if="activeTab === 'danger'" class="space-y-4 sm:space-y-6">
            <div>
              <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Danger Zone</h2>
              <p class="text-gray-600 mb-4 sm:mb-6">Actions in this section can have permanent effects on your account</p>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <h3 class="text-base sm:text-lg font-medium text-red-700">Delete Your Account</h3>
              <p class="text-sm text-red-600 mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <div class="mt-4">
                <button
                  @click="openDeleteConfirmModal"
                  class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <font-awesome-icon icon="trash-alt" class="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Use the lazy-loaded DeleteAccountModal component -->
  <DeleteAccountModal
    :show="showDeleteConfirmModal"
    :confirm-phrase="confirmDeletePhrase"
    @close="closeDeleteConfirmModal"
    @confirm="handleDeleteAccount"
  />
</template>
