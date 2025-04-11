<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('login')
const isLoading = computed(() => userStore.isLoading)
const storeError = computed(() => userStore.error)

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
}

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const loginErrors = reactive<FormErrors>({})

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const registerErrors = reactive<FormErrors>({})

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 8
}

const validateLoginForm = (): boolean => {
  loginErrors.email = ''
  loginErrors.password = ''
  let isValid = true

  if (!loginForm.email) {
    loginErrors.email = 'Email is required'
    isValid = false
  } else if (!validateEmail(loginForm.email)) {
    loginErrors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!loginForm.password) {
    loginErrors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const validateRegisterForm = (): boolean => {
  registerErrors.firstName = ''
  registerErrors.lastName = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
  let isValid = true

  if (!registerForm.firstName.trim()) {
    registerErrors.firstName = 'First name is required'
    isValid = false
  }

  if (!registerForm.lastName.trim()) {
    registerErrors.lastName = 'Last name is required'
    isValid = false
  }

  if (!registerForm.email) {
    registerErrors.email = 'Email is required'
    isValid = false
  } else if (!validateEmail(registerForm.email)) {
    registerErrors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!registerForm.password) {
    registerErrors.password = 'Password is required'
    isValid = false
  } else if (!validatePassword(registerForm.password)) {
    registerErrors.password = 'Password must be at least 8 characters long'
    isValid = false
  }

  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (isLoading.value) return

  if (!validateLoginForm()) return

  try {
    await userStore.login(loginForm.email, loginForm.password, loginForm.rememberMe)
    router.push('/home')
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleRegister = async () => {
  if (isLoading.value) return

  if (!validateRegisterForm()) return

  try {
    await userStore.register({
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      email: registerForm.email,
      password: registerForm.password
    })
    router.push('/home')
  } catch (error) {
    console.error('Registration error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" style="background-size: 30px 30px;"></div>
    <!-- Left Column: Illustration and Text -->
    <div class="hidden lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:pr-8 relative z-10">
      <img src="@/assets/login-illustration.svg" alt="Developer Illustration" class="w-full max-w-lg mb-8 transform hover:scale-105 transition-transform duration-300 ease-out" />
      <h1 class="text-4xl font-bold text-text-primary mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Connect. Collaborate. Code.</h1>
      <p class="text-xl text-text-secondary text-center max-w-md animate-fade-in">
        Join our community of passionate developers and find your perfect coding partner. Start building amazing projects together.
      </p>
    </div>

    <!-- Right Column: Authentication Forms -->
    <div class="w-full max-w-xl lg:w-1/2 lg:max-w-2xl relative z-10">
      <div class="bg-card/90 backdrop-blur-sm py-16 px-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl transition-all duration-300 hover:shadow-2xl hover:bg-card/95">
        <h2 class="text-center text-3xl font-bold tracking-tight text-text-primary mb-8">{{ activeTab === 'login' ? 'Welcome Back' : 'Create Account' }}</h2>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-8">
          <div>
            <label for="email" class="block text-sm font-medium text-text-primary">Email</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="loginForm.email"
                placeholder="Enter your email"
                :class="{'ring-red-500': loginErrors.email}"
                class="block w-full rounded-md border-0 py-3.5 px-4 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="loginErrors.email" class="mt-2 text-sm text-red-600">{{ loginErrors.email }}</p>
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
                class="block w-full rounded-md border-0 py-3.5 px-4 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="loginErrors.password" class="mt-2 text-sm text-red-600">{{ loginErrors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-colors duration-200 cursor-pointer hover:border-primary"
              />
              <label for="remember-me" class="ml-2 block text-sm text-text-secondary">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-primary/80">Forgot password?</a>
            </div>
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
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-8">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-text-primary">First Name</label>
              <div class="mt-1">
                <input
                  id="firstName"
                  v-model="registerForm.firstName"
                  :class="{'ring-red-500': registerErrors.firstName}"
                  class="block w-full rounded-md border-0 py-3 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                />
                <p v-if="registerErrors.firstName" class="mt-2 text-sm text-red-600">{{ registerErrors.firstName }}</p>
              </div>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-text-primary">Last Name</label>
              <div class="mt-1">
                <input
                  id="lastName"
                  v-model="registerForm.lastName"
                  :class="{'ring-red-500': registerErrors.lastName}"
                  class="block w-full rounded-md border-0 py-3 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                />
                <p v-if="registerErrors.lastName" class="mt-2 text-sm text-red-600">{{ registerErrors.lastName }}</p>
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
                class="block w-full rounded-md border-0 py-3 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="registerErrors.email" class="mt-2 text-sm text-red-600">{{ registerErrors.email }}</p>
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
                class="block w-full rounded-md border-0 py-3 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="registerErrors.password" class="mt-2 text-sm text-red-600">{{ registerErrors.password }}</p>
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
                class="block w-full rounded-md border-0 py-3 px-3 text-text-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
              <p v-if="registerErrors.confirmPassword" class="mt-2 text-sm text-red-600">{{ registerErrors.confirmPassword }}</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex w-full justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70"
            >
              <span :class="{ 'opacity-0': isLoading }">Create Account</span>
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
