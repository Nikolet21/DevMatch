<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingStore, type SettingsError } from '@/stores/settingStore'
import { validateSettingsPasswordForm, validateSettingsEmailForm, type SettingsFormErrors } from '@/utils/validation'

const router = useRouter()
const settingStore = useSettingStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const email = ref('')
const newEmail = ref('')
const confirmEmail = ref('')

const formErrors = reactive<SettingsFormErrors>({})

const isLoading = computed(() => settingStore.isLoading)
const errors = computed<SettingsError>(() => settingStore.errors)
const successMessage = computed(() => settingStore.successMessage)

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
    email.value = ''
    newEmail.value = ''
    confirmEmail.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-500 to-purple-100 py-16">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
      <!-- Return Button -->
      <button
        @click="goToHome"
        class="mb-8 inline-flex items-center px-4 py-2 bg-white/90 text-indigo-600 rounded-lg hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Return to Home
      </button>

      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white">Settings</h1>
        <p class="mt-2 text-white/90">Manage your account settings and preferences</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <!-- Password Change Section -->
        <div class="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-8 flex flex-col min-h-[400px]">
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-gray-900">Change Password</h2>
            <p class="text-gray-600 text-sm">Update your password to keep your account secure</p>
          </div>

          <form @submit.prevent="handlePasswordChange" class="flex-1 flex flex-col space-y-4">
            <div v-if="errors.password || errors.general" class="text-red-600 text-sm">
              {{ errors.password || errors.general }}
            </div>
            <div v-if="!errors.password && !errors.general && successMessage" class="text-green-600 text-sm">
              {{ successMessage }}
            </div>
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-900">Current Password</label>
              <input
                id="currentPassword"
                v-model="currentPassword"
                type="password"
                :class="{
                  'ring-red-500': formErrors.currentPassword,
                  'focus:ring-red-500': formErrors.currentPassword
                }"
                class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p v-if="formErrors.currentPassword" class="mt-2 text-sm text-red-600">{{ formErrors.currentPassword }}</p>
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-900">New Password</label>
              <input
                id="newPassword"
                v-model="newPassword"
                type="password"
                :class="{
                  'ring-red-500': formErrors.newPassword,
                  'focus:ring-red-500': formErrors.newPassword
                }"
                class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p v-if="formErrors.newPassword" class="mt-2 text-sm text-red-600">{{ formErrors.newPassword }}</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-900">Confirm New Password</label>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                :class="{
                  'ring-red-500': formErrors.confirmPassword,
                  'focus:ring-red-500': formErrors.confirmPassword
                }"
                class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p v-if="formErrors.confirmPassword" class="mt-2 text-sm text-red-600">{{ formErrors.confirmPassword }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Email Change Section -->
        <div class="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-8 flex flex-col min-h-[400px]">
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-gray-900">Change Email</h2>
            <p class="text-gray-600 text-sm">Update your email address for account notifications</p>
          </div>

          <form @submit.prevent="handleEmailChange" class="flex-1 flex flex-col space-y-4">
            <div v-if="errors.email || errors.general" class="text-red-600 text-sm">
              {{ errors.email || errors.general }}
            </div>
            <div v-if="!errors.email && !errors.general && successMessage" class="text-green-600 text-sm">
              {{ successMessage }}
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-900">Current Email</label>
              <input
                id="email"
                v-model="email"
                type="text"
                :class="{
                  'ring-red-500': formErrors.currentEmail,
                  'focus:ring-red-500': formErrors.currentEmail
                }"
                class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p v-if="formErrors.currentEmail" class="mt-2 text-sm text-red-600">{{ formErrors.currentEmail }}</p>
            </div>

            <div>
              <label for="newEmail" class="block text-sm font-medium text-gray-900">New Email</label>
              <input
                id="newEmail"
                v-model="newEmail"
                type="text"
                :class="{
                  'ring-red-500': formErrors.newEmail,
                  'focus:ring-red-500': formErrors.newEmail
                }"
                class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p v-if="formErrors.newEmail" class="mt-2 text-sm text-red-600">{{ formErrors.newEmail }}</p>
            </div>

            <div>
              <label for="confirmEmail" class="block text-sm font-medium text-gray-900">Confirm New Email</label>
              <input
                id="confirmEmail"
                v-model="confirmEmail"
                type="text"
                :class="{
                  'ring-red-500': formErrors.confirmEmail,
                  'focus:ring-red-500': formErrors.confirmEmail
                }"
                class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <p v-if="formErrors.confirmEmail" class="mt-2 text-sm text-red-600">{{ formErrors.confirmEmail }}</p>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isLoading"
                class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Updating...' : 'Update Email' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
