<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminAccount } from '@/data/mockData'

const router = useRouter()
const isLoading = ref(false)
const loginError = ref('')

const loginForm = reactive({
  email: '',
  password: ''
})

// Check if already authenticated
onMounted(() => {
  const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
  if (isAdminAuthenticated) {
    router.push('/admin')
  }
})

const handleAdminLogin = async () => {
  if (isLoading.value) return

  // Validate form
  if (!loginForm.email || !loginForm.password) {
    loginError.value = 'Please enter email and password'
    return
  }

  isLoading.value = true
  loginError.value = ''

  try {
    // Authenticate against admin account
    if (loginForm.email === adminAccount.email && loginForm.password === adminAccount.password) {
      // Store admin session info
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminEmail', adminAccount.email)
      localStorage.setItem('adminName', `${adminAccount.firstName} ${adminAccount.lastName}`)

      router.push('/admin')
    } else {
      throw new Error('Invalid admin credentials')
    }
  } catch (error) {
    loginError.value = 'Invalid admin credentials'
    console.error('Admin login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-card shadow-lg rounded-lg p-8">
        <!-- Logo and title -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-text-primary">DevMatch Admin</h2>
          <p class="text-text-secondary mt-2 text-center">Enter your credentials to access the admin dashboard</p>
        </div>

        <form @submit.prevent="handleAdminLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-text-primary">Email</label>
            <div class="mt-1 relative rounded-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                placeholder="Enter your email"
                class="block w-full pl-10 rounded-md border border-gray-300 py-2 text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-text-primary">Password</label>
            <div class="mt-1 relative rounded-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="Enter your password"
                class="block w-full pl-10 rounded-md border border-gray-300 py-2 text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                required
              />
            </div>
          </div>

          <div v-if="loginError" class="bg-red-50 text-error px-4 py-3 rounded-md text-sm border border-red-200">
            {{ loginError }}
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
            >
              <span :class="{ 'opacity-0': isLoading }">Sign in to Dashboard</span>
              <div
                v-if="isLoading"
                class="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-text-secondary">
            Protected area • Admin access only
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
