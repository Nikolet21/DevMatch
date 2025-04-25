<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { LoginFormErrors, RegisterFormErrors } from '@/utils/validation'
import {
  validateLoginForm,
  validateRegisterForm,
  validatePasswordRequirements
} from '@/utils/validation'
import { useActivityLogger } from '@/composables/useActivityLogger'

const router = useRouter()
const userStore = useUserStore()
const { logActivity } = useActivityLogger()
const activeTab = ref('login')
const isLoading = computed(() => userStore.isLoading)
const storeError = computed(() => userStore.error)

const loginForm = reactive({
  email: '',
  password: ''
})

const loginErrors = reactive<LoginFormErrors>({})

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const registerErrors = reactive<RegisterFormErrors>({})

// Password validation requirements
const passwordRequirements = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false
})

// Watch password changes to update requirements status
watch(() => registerForm.password, (newPassword) => {
  const requirements = validatePasswordRequirements(newPassword)
  Object.assign(passwordRequirements, requirements)
})

const validateLoginFormLocal = (): boolean => {
  const errors = validateLoginForm(loginForm)
  Object.assign(loginErrors, errors)
  return Object.keys(errors).length === 0
}

const validateRegisterFormLocal = (): boolean => {
  const errors = validateRegisterForm(registerForm)
  Object.assign(registerErrors, errors)
  return Object.keys(errors).length === 0
}

const handleLogin = async () => {
  if (isLoading.value) return

  if (!validateLoginFormLocal()) return

  try {
    await userStore.login(loginForm.email, loginForm.password)

    // Log successful login
    logActivity('Login', {
      email: loginForm.email
    })

    router.push('/home')
  } catch (error) {
    // Log failed login attempt
    logActivity('Login Attempt Failed', {
      reason: 'Invalid credentials',
      email: loginForm.email
    })

    loginErrors.email = storeError.value || undefined
    loginErrors.password = storeError.value || undefined
    console.error('Login error:', error)
  }
}

const handleRegister = async () => {
  if (isLoading.value) return

  if (!validateRegisterFormLocal()) return

  try {
    await userStore.register({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      password: registerForm.password
    })

    // Log account creation
    logActivity('Login', {
      email: registerForm.email,
      description: `New user registered with email: ${registerForm.email}`
    })

    router.push('/home')
  } catch (error) {
    // Log registration error
    logActivity('Login Attempt Failed', {
      reason: 'Registration error',
      email: registerForm.email
    })

    console.error('Registration error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" style="background-size: 30px 30px;"></div>

    <!-- Left Column: Illustration and Text -->
    <div class="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:pr-4 xl:pr-8 relative z-10">
      <img src="@/assets/login-illustration.svg" alt="Developer Illustration" class="w-full max-w-md xl:max-w-lg mb-6 xl:mb-8 transform hover:scale-105 transition-transform duration-300 ease-out" />
      <h1 class="text-3xl xl:text-4xl font-bold text-text-primary mb-3 xl:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Connect. Collaborate. Code.</h1>
      <p class="text-lg xl:text-xl text-text-secondary text-center max-w-md animate-fade-in">
        Join our community of passionate developers and find your perfect coding partner. Start building amazing projects together.
      </p>
    </div>

    <!-- Right Column: Authentication Forms -->
    <div class="w-full max-w-xs sm:max-w-xs md:max-w-sm lg:w-5/12 lg:max-w-md relative z-10">
      <div class="bg-card/90 backdrop-blur-sm py-6 sm:py-8 lg:py-10 px-4 sm:px-5 lg:px-6 shadow-xl ring-1 ring-gray-900/5 rounded-xl transition-all duration-300 hover:shadow-2xl hover:bg-card/95">
        <h2 class="text-center text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-5 sm:mb-6">{{ activeTab === 'login' ? 'Welcome Back' : 'Create Account' }}</h2>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-text-primary">Email</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="loginForm.email"
                placeholder="Enter your email"
                :class="{'ring-red-500': loginErrors.email}"
                class="block w-full rounded-md border-0 py-2.5 px-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="loginErrors.email" class="mt-1 text-xs sm:text-sm text-red-600">{{ loginErrors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-text-primary">Password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="Enter your password"
                :class="{'ring-red-500': loginErrors.password}"
                class="block w-full rounded-md border-0 py-2.5 px-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="loginErrors.password" class="mt-1 text-xs sm:text-sm text-red-600">{{ loginErrors.password }}</p>
            </div>
          </div>

          <div class="text-right">
            <a href="#" class="font-medium text-primary text-sm hover:text-primary/80">Forgot password?</a>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative flex w-full justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70"
            >
              <span :class="{ 'opacity-0': isLoading }">Sign In</span>
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
            <p class="mt-4 text-center text-sm text-text-secondary">
              Don't have an account?
              <button
                type="button"
                @click="activeTab = 'register'"
                class="font-medium text-primary hover:text-primary/80 focus:outline-none"
              >
                Create one now
              </button>
            </p>
          </div>
        </form>

        <!-- Registration Form -->
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4 sm:space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-text-primary">First Name</label>
              <div class="mt-1">
                <input
                  id="firstName"
                  v-model="registerForm.firstName"
                  :class="{'ring-red-500': registerErrors.firstName}"
                  class="block w-full rounded-md border-0 py-2 sm:py-2.5 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                />
                <p v-if="registerErrors.firstName" class="mt-1 text-xs text-red-600">{{ registerErrors.firstName }}</p>
              </div>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-text-primary">Last Name</label>
              <div class="mt-1">
                <input
                  id="lastName"
                  v-model="registerForm.lastName"
                  :class="{'ring-red-500': registerErrors.lastName}"
                  class="block w-full rounded-md border-0 py-2 sm:py-2.5 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                />
                <p v-if="registerErrors.lastName" class="mt-1 text-xs text-red-600">{{ registerErrors.lastName }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="register-email" class="block text-sm font-medium text-text-primary">Email</label>
            <div class="mt-1">
              <input
                id="register-email"
                v-model="registerForm.email"
                :class="{'ring-red-500': registerErrors.email}"
                class="block w-full rounded-md border-0 py-2 sm:py-2.5 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="registerErrors.email" class="mt-1 text-xs text-red-600">{{ registerErrors.email }}</p>
            </div>
          </div>

          <div>
            <label for="register-password" class="block text-sm font-medium text-text-primary">Password</label>
            <div class="mt-1">
              <input
                id="register-password"
                v-model="registerForm.password"
                type="password"
                :class="{'ring-red-500': registerErrors.password}"
                class="block w-full rounded-md border-0 py-2 sm:py-2.5 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="registerErrors.password" class="mt-1 text-xs text-red-600">{{ registerErrors.password }}</p>

              <!-- Password Requirements List -->
              <div class="mt-2 space-y-1 text-xs">
                <p class="text-text-secondary font-medium">Password requirements:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-0.5">
                  <div class="flex items-center space-x-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      :class="passwordRequirements.length ? 'text-green-500' : 'text-gray-400'"
                      class="h-3 w-3 transition-colors duration-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span :class="passwordRequirements.length ? 'text-text-primary' : 'text-text-secondary'">
                      Minimum 8 characters
                    </span>
                  </div>
                  <div class="flex items-center space-x-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      :class="passwordRequirements.uppercase ? 'text-green-500' : 'text-gray-400'"
                      class="h-3 w-3 transition-colors duration-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span :class="passwordRequirements.uppercase ? 'text-text-primary' : 'text-text-secondary'">
                      At least 1 uppercase
                    </span>
                  </div>
                  <div class="flex items-center space-x-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      :class="passwordRequirements.lowercase ? 'text-green-500' : 'text-gray-400'"
                      class="h-3 w-3 transition-colors duration-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span :class="passwordRequirements.lowercase ? 'text-text-primary' : 'text-text-secondary'">
                      At least 1 lowercase
                    </span>
                  </div>
                  <div class="flex items-center space-x-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      :class="passwordRequirements.number ? 'text-green-500' : 'text-gray-400'"
                      class="h-3 w-3 transition-colors duration-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span :class="passwordRequirements.number ? 'text-text-primary' : 'text-text-secondary'">
                      At least 1 number
                    </span>
                  </div>
                  <div class="flex items-center space-x-1.5 md:col-span-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      :class="passwordRequirements.special ? 'text-green-500' : 'text-gray-400'"
                      class="h-3 w-3 transition-colors duration-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span :class="passwordRequirements.special ? 'text-text-primary' : 'text-text-secondary'">
                      At least 1 special character
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-text-primary">Confirm Password</label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                type="password"
                :class="{'ring-red-500': registerErrors.confirmPassword}"
                class="block w-full rounded-md border-0 py-2 sm:py-2.5 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="registerErrors.confirmPassword" class="mt-1 text-xs text-red-600">{{ registerErrors.confirmPassword }}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70"
            >
              <span :class="{ 'opacity-0': isLoading }">Create Account</span>
              <div
                v-if="isLoading"
                class="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  class="animate-spin h-4 w-4 text-white"
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
            <p class="mt-3 text-center text-xs text-text-secondary">
              Already have an account?
              <button
                type="button"
                @click="activeTab = 'login'"
                class="font-medium text-primary hover:text-primary/80 focus:outline-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
