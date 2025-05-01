<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Lazy load the SignOutModal component
const SignOutModal = defineAsyncComponent(() => import('@/components/modals/SignOutModal.vue'))

const router = useRouter()
const userStore = useUserStore()
const isHeaderVisible = ref(true)
const lastScrollPosition = ref(0)
const animatedElements = ref<HTMLElement[]>([])
const isMobileMenuOpen = ref(false)
const showSignOutModal = ref(false)

// Check if user is logged in
const isAuthenticated = computed(() => userStore.isAuthenticated)

const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  isHeaderVisible.value = currentScrollPosition < lastScrollPosition.value || currentScrollPosition < 50
  lastScrollPosition.value = currentScrollPosition
  
  // Check for elements in viewport to animate
  checkElementsInViewport()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // If opening mobile menu, prevent scrolling
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const navigateToLogin = () => {
  closeMobileMenu()
  router.push('/login')
}

const navigateToDashboard = () => {
  closeMobileMenu()
  router.push('/home')
}

const openSignOutModal = () => {
  closeMobileMenu()
  showSignOutModal.value = true
}

const handleSignOutConfirm = () => {
  userStore.logout()
  showSignOutModal.value = false
  // Ensure body overflow is reset after modal closes
  setTimeout(() => {
    document.body.style.overflow = ''
  }, 300)
}

const handleSignOutCancel = () => {
  showSignOutModal.value = false
  // Ensure body overflow is reset after modal closes
  setTimeout(() => {
    document.body.style.overflow = ''
  }, 300)
}

const scrollToFeatures = () => {
  closeMobileMenu()
  const featuresSection = document.getElementById('features-section')
  if (featuresSection) {
    const headerHeight = 64
    const targetPosition = featuresSection.offsetTop - headerHeight
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }
}

// Custom intersection observer implementation without vueuse/core
const checkElementsInViewport = () => {
  animatedElements.value.forEach(element => {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    
    // Check if element is in viewport
    if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
      element.classList.add('visible')
    }
  })
}

// Initialize animations and scroll handler
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Collect all elements with animate-on-scroll class
  animatedElements.value = Array.from(document.querySelectorAll('.animate-on-scroll'))
  
  // Initial check for elements in viewport
  checkElementsInViewport()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // Ensure we reset overflow if component is unmounted with menu open
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Mobile menu -->
    <div 
      class="fixed inset-0 z-60 md:hidden overflow-hidden"
      :class="isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'"
      aria-modal="true"
      role="dialog"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
        :class="isMobileMenuOpen ? 'opacity-100' : 'opacity-0'"
        @click="closeMobileMenu"
      ></div>
      
      <!-- Menu panel -->
      <div 
        class="absolute inset-y-0 right-0 w-3/4 max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 flex flex-col"
        :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="px-6 pt-8 pb-4 flex items-center justify-between border-b border-gray-200/60">
          <h2 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevMatch</h2>
          <button 
            @click="closeMobileMenu"
            class="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 px-6 py-6">
          <nav class="flex flex-col space-y-5">
            <a 
              href="#features-section"
              @click.prevent="scrollToFeatures"
              class="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              Features
            </a>
            <router-link 
              to="/about"
              @click="closeMobileMenu"
              class="text-lg font-medium text-text-primary hover:text-primary transition-colors duration-200"
            >
              About
            </router-link>
          </nav>
        </div>
        
        <div class="px-6 py-6 border-t border-gray-200/60">
          <div class="flex flex-col space-y-4">
            <template v-if="isAuthenticated">
              <button
                @click="navigateToDashboard"
                class="w-full rounded-xl bg-primary py-3 text-center font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200"
              >
                Dashboard
              </button>
              <button
                @click="openSignOutModal"
                class="w-full rounded-xl bg-white py-3 text-center font-semibold text-primary border border-primary/20 shadow-sm hover:bg-gray-50 transition-all duration-200"
              >
                Sign Out
              </button>
            </template>
            <button
              v-else
              @click="navigateToLogin"
              class="w-full rounded-xl bg-primary py-3 text-center font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm"
      :class="{ 'translate-y-0 shadow-md': isHeaderVisible, '-translate-y-full': !isHeaderVisible }"
      :style="{ backgroundColor: 'rgba(249, 250, 251, ' + (lastScrollPosition > 50 ? '0.85' : '0.5') + ')' }">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <a href="#" class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevMatch</a>
          </div>
          <div class="hidden md:block">
            <div class="flex items-center space-x-8">
              <a href="#features-section"
                @click.prevent="scrollToFeatures"
                class="text-text-secondary hover:text-primary transition-colors duration-200 font-medium">Features</a>
              <router-link to="/about" class="text-text-secondary hover:text-primary transition-colors duration-200 font-medium">About</router-link>
              
              <!-- Conditional buttons based on authentication status -->
              <template v-if="isAuthenticated">
                <button
                  @click="navigateToDashboard"
                  class="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-md">
                  Dashboard
                </button>
                <button
                  @click="openSignOutModal"
                  class="rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary border border-primary/20 shadow-sm hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                  Sign Out
                </button>
              </template>
              <button
                v-else
                @click="navigateToLogin"
                class="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-md">
                Sign In
              </button>
            </div>
          </div>
          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button 
              type="button" 
              class="text-text-primary p-2 rounded-md hover:bg-primary/10 transition-colors duration-200"
              @click="toggleMobileMenu"
              aria-label="Toggle mobile menu"
              :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path 
                  v-if="!isMobileMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-48 lg:pb-32">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background z-0"></div>
      <div class="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="text-center md:text-left">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
              Connect with Developers Who Match Your Code
            </h1>
            <p class="mt-6 text-lg text-text-secondary leading-relaxed">
              Find your perfect coding partner through our intelligent matching system. Whether you're looking for a project
              collaborator, mentor, or fellow learner, DevMatch helps you connect with developers who share your interests
              and goals.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <!-- Conditional button based on authentication status -->
              <button v-if="isAuthenticated"
                @click="navigateToDashboard"
                class="rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1">
                Go to Dashboard
              </button>
              <button v-else
                @click="navigateToLogin"
                class="rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1">
                Get Started
              </button>
              <router-link to="/about"
                class="rounded-full bg-white/80 backdrop-blur-sm px-6 py-3 text-base font-semibold text-primary shadow-sm ring-1 ring-primary/10 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                Learn More
              </router-link>
            </div>
          </div>
          <div class="relative hidden md:block">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl"></div>
            <img src="../assets/hero-illustration.svg" alt="Code matching illustration" class="relative mx-auto w-full max-w-xl rounded-2xl shadow-xl ring-1 ring-gray-400/10" />
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
    </section>

    <!-- Features Section -->
    <section id="features-section" class="relative py-20 md:py-28 lg:py-36">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Match. Connect. Code.</h2>
          <p class="mt-6 text-lg text-text-secondary">
            Our platform makes it easy to find developers who match your interests, skills, and goals.
          </p>
        </div>
        
        <div class="mx-auto max-w-7xl space-y-12 md:space-y-16">
          <!-- Feature 1: Developer Profiles -->
          <div class="animate-on-scroll opacity-0 translate-y-8 md:translate-y-0 md:-translate-x-16">
            <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-5 md:p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-primary/10">
              <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h3 class="text-2xl font-bold text-text-primary">Developer Profiles</h3>
                <p class="mt-3 text-lg text-text-secondary">Create your profile with basic information including name, picture, bio, and location. Showcase your skills in programming languages, frameworks, and tools.</p>
              </div>
              <img src="../assets/developer-profiles.svg" alt="Developer Profiles" class="w-40 h-40 md:w-48 md:h-48 object-contain hidden lg:block" />
            </div>
          </div>
          
          <!-- Feature 2: Matching Functionality -->
          <div class="animate-on-scroll opacity-0 translate-y-8 md:translate-y-0 md:translate-x-16">
            <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-5 md:p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-secondary/10">
              <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center md:order-1 order-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="flex-1 text-center md:text-left order-2 md:order-2">
                <h3 class="text-2xl font-bold text-text-primary">Matching Functionality</h3>
                <p class="mt-3 text-lg text-text-secondary">Swipe right if you're interested in connecting with a developer, or swipe left to skip. When both developers swipe right, it's a match!</p>
              </div>
              <img src="../assets/matching-functionality.svg" alt="Matching Functionality" class="w-40 h-40 md:w-48 md:h-48 object-contain hidden sm:block lg:block order-3 md:order-3" />
            </div>
          </div>
          
          <!-- Feature 3: Messaging System -->
          <div class="animate-on-scroll opacity-0 translate-y-8 md:translate-y-0 md:-translate-x-16">
            <div class="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-5 md:p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-success/10">
              <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h3 class="text-2xl font-bold text-text-primary">Messaging System</h3>
                <p class="mt-3 text-lg text-text-secondary">Once matched, instantly connect through our real-time messaging system. Send and receive messages with a simple text-based interface.</p>
              </div>
              <img src="../assets/messaging-system.svg" alt="Messaging System" class="w-40 h-40 md:w-48 md:h-48 object-contain hidden sm:block lg:block" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div class="container mx-auto max-w-5xl px-6 sm:px-8 relative z-10">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 shadow-xl border border-primary/10">
          <div class="mx-auto max-w-3xl text-center">
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-text-primary sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ isAuthenticated ? 'Continue exploring DevMatch' : 'Ready to find your perfect match?' }}</h2>
            <p class="mx-auto mt-4 md:mt-6 max-w-xl text-base md:text-lg text-text-secondary">
              {{ isAuthenticated ? 'Start exploring new developer profiles and making connections.' : 'Join thousands of developers who have found their ideal coding partners through DevMatch.' }}
            </p>
            <div class="mt-10 flex justify-center">
              <button v-if="isAuthenticated"
                @click="navigateToDashboard"
                class="rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-md hover:shadow-xl hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1">
                View Dashboard
              </button>
              <button v-else
                @click="navigateToLogin"
                class="rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-md hover:shadow-xl hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-1/3 left-0 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/3 right-0 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl"></div>
    </section>

    <!-- Footer -->
    <footer class="bg-gradient-to-b from-background to-primary/5 pt-12 md:pt-16 pb-6 md:pb-8">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 pb-8 md:pb-12">
          <!-- Company Info -->
          <div class="col-span-2 md:col-span-1 space-y-3 md:space-y-4">
            <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevMatch</h3>
            <p class="text-text-secondary">Connecting developers worldwide through intelligent matching and collaboration.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">
                <span class="sr-only">GitHub</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">
                <span class="sr-only">LinkedIn</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Resources -->
          <div class="space-y-2 md:space-y-3">
            <h3 class="text-lg font-semibold text-text-primary">Resources</h3>
            <ul class="space-y-2 md:space-y-3">
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Documentation</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">API Reference</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Blog</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Community</a>
              </li>
            </ul>
          </div>
          
          <!-- Company -->
          <div class="space-y-2 md:space-y-3">
            <h3 class="text-lg font-semibold text-text-primary">Company</h3>
            <ul class="space-y-2 md:space-y-3">
              <li>
                <router-link to="/about" class="text-text-secondary hover:text-primary transition-colors duration-200">About Us</router-link>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Careers</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Press</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Contact</a>
              </li>
            </ul>
          </div>
          
          <!-- Legal -->
          <div class="space-y-2 md:space-y-3">
            <h3 class="text-lg font-semibold text-text-primary">Legal</h3>
            <ul class="space-y-2 md:space-y-3">
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Terms of Service</a>
              </li>
              <li>
                <a href="#" class="text-text-secondary hover:text-primary transition-colors duration-200">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-primary/10 pt-8">
          <p class="text-center text-sm text-text-secondary">&copy; 2025 DevMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
    
    <!-- SignOut Modal -->
    <SignOutModal 
      v-if="showSignOutModal" 
      @confirm="handleSignOutConfirm"
      @cancel="handleSignOutCancel"
    />
  </div>
</template>

<style scoped>
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

/* Custom z-index for mobile menu */
.z-60 {
  z-index: 60;
}
</style>
