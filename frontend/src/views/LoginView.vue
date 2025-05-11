<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
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
const animatedElements = ref<HTMLElement[]>([])

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

const accountText = computed(() => ({
  message: activeTab.value === 'login' ? "Don't have an account?" : 'Already have an account?',
  action: activeTab.value === 'login' ? 'Create one now' : 'Sign in'
}))

// Custom animation handling
const checkElementsInViewport = () => {
  animatedElements.value.forEach(element => {
    element.classList.add('visible')
  })
}

onMounted(() => {
  // Collect all elements with animate-on-scroll class
  animatedElements.value = Array.from(document.querySelectorAll('.animate-on-scroll'))
  
  // Initial check for elements in viewport with a slight delay for animation effect
  setTimeout(() => {
    checkElementsInViewport()
  }, 100)
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 z-0"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
    <div class="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] z-0"></div>
    
    <!-- Header -->
    <header class="relative z-10 pt-4 px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          DevMatch
        </router-link>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 relative z-10">
      <div class="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        <!-- Left Column: Illustration and Text -->
        <div class="hidden md:flex flex-col items-center text-center animate-on-scroll opacity-0 translate-y-8">
          <img src="@/assets/login-illustration.svg" alt="Developer Illustration" class="w-full max-w-md mb-8" />
          <h1 class="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Connect. Collaborate. Code.</h1>
          <p class="text-lg text-text-secondary max-w-md">
            Join our community of passionate developers and find your perfect coding partner. Start building amazing projects together.
          </p>
        </div>
        
        <!-- Right Column: Authentication Forms -->
        <div class="w-full max-w-md mx-auto md:ml-auto md:mr-0 animate-on-scroll opacity-0 translate-y-8">
          <div class="bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl ring-1 ring-gray-900/5 rounded-3xl transition-all duration-300 hover:shadow-2xl">
            <!-- Tabs -->
            <div class="flex justify-center mb-6 border-b border-gray-200">
              <button 
                @click="activeTab = 'login'" 
                class="pb-2 px-4 text-sm font-medium transition-all duration-200"
                :class="activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'">
                Sign In
              </button>
              <button 
                @click="activeTab = 'register'" 
                class="pb-2 px-4 text-sm font-medium transition-all duration-200"
                :class="activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'">
                Create Account
              </button>
            </div>
            
            <h2 class="text-center text-2xl font-bold text-text-primary mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {{ activeTab === 'login' ? 'Welcome Back' : 'Join DevMatch' }}
            </h2>

            <!-- Login Form -->
            <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-text-primary mb-1">Email</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    v-model="loginForm.email"
                    placeholder="Enter your email"
                    :class="{'ring-red-500': loginErrors.email}"
                    class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  />
                </div>
                <p v-if="loginErrors.email" class="mt-1 text-sm text-red-600">{{ loginErrors.email }}</p>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-text-primary mb-1">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    v-model="loginForm.password"
                    type="password"
                    placeholder="Enter your password"
                    :class="{'ring-red-500': loginErrors.password}"
                    class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  />
                </div>
                <p v-if="loginErrors.password" class="mt-1 text-sm text-red-600">{{ loginErrors.password }}</p>
              </div>

              <div class="text-right">
                <a href="#" class="font-medium text-primary text-sm hover:text-primary/80 transition-colors duration-200">Forgot password?</a>
              </div>

              <div>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="relative w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 overflow-hidden"
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
              </div>
            </form>

            <!-- Registration Form -->
            <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-text-primary mb-1">First Name</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="firstName"
                      v-model="registerForm.firstName"
                      placeholder="First name"
                      :class="{'ring-red-500': registerErrors.firstName}"
                      class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <p v-if="registerErrors.firstName" class="mt-1 text-xs text-red-600">{{ registerErrors.firstName }}</p>
                </div>

                <div>
                  <label for="lastName" class="block text-sm font-medium text-text-primary mb-1">Last Name</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="lastName"
                      v-model="registerForm.lastName"
                      placeholder="Last name"
                      :class="{'ring-red-500': registerErrors.lastName}"
                      class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <p v-if="registerErrors.lastName" class="mt-1 text-xs text-red-600">{{ registerErrors.lastName }}</p>
                </div>
              </div>

              <div>
                <label for="register-email" class="block text-sm font-medium text-text-primary mb-1">Email</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="register-email"
                    v-model="registerForm.email"
                    placeholder="Email address"
                    :class="{'ring-red-500': registerErrors.email}"
                    class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  />
                </div>
                <p v-if="registerErrors.email" class="mt-1 text-xs text-red-600">{{ registerErrors.email }}</p>
              </div>

              <div>
                <label for="register-password" class="block text-sm font-medium text-text-primary mb-1">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="register-password"
                    v-model="registerForm.password"
                    type="password"
                    placeholder="Create password"
                    :class="{'ring-red-500': registerErrors.password}"
                    class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  />
                </div>
                <p v-if="registerErrors.password" class="mt-1 text-xs text-red-600">{{ registerErrors.password }}</p>

                <!-- Password Requirements List -->
                <div class="mt-2 space-y-1 text-xs p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p class="text-text-secondary font-medium">Password requirements:</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1">
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

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-text-primary mb-1">Confirm Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    v-model="registerForm.confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    :class="{'ring-red-500': registerErrors.confirmPassword}"
                    class="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-text-primary bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  />
                </div>
                <p v-if="registerErrors.confirmPassword" class="mt-1 text-xs text-red-600">{{ registerErrors.confirmPassword }}</p>
              </div>

              <div>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="relative w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 overflow-hidden"
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="relative z-10 py-4 px-4 sm:px-6 lg:px-8">
      <div class="container mx-auto text-center text-sm text-text-secondary">
        <p>&copy; 2025 DevMatch. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.bg-grid-primary {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animation classes */
.animate-on-scroll {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.visible {
  opacity: 1 !important;
  transform: translate(0, 0) !important;
}

@media (max-width: 768px) {
  .animate-on-scroll {
    transform: translateY(30px);
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .animate-on-scroll {
    transform: translateY(20px);
  }
}
</style>
