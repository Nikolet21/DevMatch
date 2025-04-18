<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'

const router = useRouter()
const isHeaderVisible = ref(true)
const lastScrollPosition = ref(0)
const featureRefs = ref<HTMLElement[]>([])
const isVisible = ref<boolean[]>([])

const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  isHeaderVisible.value = currentScrollPosition < lastScrollPosition.value || currentScrollPosition < 50
  lastScrollPosition.value = currentScrollPosition
}

const navigateToLogin = () => {
  router.push('/login')
}

const scrollToFeatures = () => {
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  featureRefs.value.forEach((el, index) => {
    if (el) {
      el.classList.add('fade-in')
      const observer = useIntersectionObserver(el, ([{ isIntersecting }]) => {
        if (isIntersecting && !isVisible.value[index]) {
          isVisible.value[index] = true
          el.classList.add('visible')
        }
      }, { threshold: 0.2 })
    }
  })

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      :class="{ '-translate-y-full': !isHeaderVisible }"
      :style="{ backgroundColor: 'rgba(255, 255, 255, ' + (lastScrollPosition > 50 ? '0.9' : '0') + ')' }">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <a href="#" class="text-2xl font-bold text-primary">DevMatch</a>
          </div>
          <div class="hidden md:block">
            <div class="flex items-center space-x-8">
              <a href="#features-section"
                @click.prevent="scrollToFeatures"
                class="text-text-secondary hover:text-primary transition-colors duration-200">Features</a>
              <router-link to="/about" class="text-text-secondary hover:text-primary transition-colors duration-200">About</router-link>
              <button
                @click="navigateToLogin"
                class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors duration-200">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-28 sm:py-36 lg:py-48">
      <div class="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:gap-y-20">
          <div class="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6">
            <h1 class="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
              Connect with Developers Who Match Your Code
            </h1>
            <p class="mt-6 text-lg text-text-secondary">
              Find your perfect coding partner through our intelligent matching system. Whether you're looking for a project
              collaborator, mentor, or fellow learner, DevMatch helps you connect with developers who share your interests
              and goals.
            </p>
            <div class="mt-8 flex gap-4">
              <button
                @click="navigateToLogin"
                class="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20">
                Get Started
              </button>
              <router-link to="/about"
                class="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/10 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">
                Learn More
              </router-link>
            </div>
          </div>
          <div class="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0">
            <div class="absolute inset-x-0 -top-16 -bottom-16 overflow-hidden bg-primary/5 rounded-3xl">
              <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background"></div>
              <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background"></div>
            </div>
            <img src="../assets/hero-illustration.svg" alt="Code matching illustration" class="relative mx-auto w-full max-w-xl rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-auto lg:w-[67.8125rem]" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features-section" class="relative overflow-hidden py-24 sm:py-36 lg:py-48">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Match. Connect. Code.</h2>
          <p class="mt-6 text-lg text-text-secondary">
            Our platform makes it easy to find developers who match your interests, skills, and goals.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-7xl">
          <div class="grid grid-cols-1 gap-12">
            <!-- Feature 1: Developer Profiles -->
            <div
              ref="el => featureRefs.value[0] = el"
              :class="{ 'fade-in': isVisible[0] }"
              class="relative rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 p-8 shadow-lg ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform">
              <div class="flex items-center space-x-6">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                  <font-awesome-icon icon="user" class="text-primary text-2xl" />
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold text-text-primary">Developer Profiles</h3>
                  <p class="mt-3 text-lg text-text-secondary">Create your profile with basic information including name, picture, bio, and location. Showcase your skills in programming languages, frameworks, and tools.</p>
                </div>
                <img src="../assets/developer-profiles.svg" alt="Developer Profiles" class="w-48 h-48 object-contain" />
              </div>
            </div>
            <!-- Feature 2: Matching Functionality -->
            <div
              ref="el => featureRefs.value[1] = el"
              :class="{ 'fade-in': isVisible[1] }"
              class="relative rounded-3xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-8 shadow-lg ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform">
              <div class="flex items-center space-x-6">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20">
                  <font-awesome-icon icon="bolt" class="text-secondary text-2xl" />
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold text-text-primary">Matching Functionality</h3>
                  <p class="mt-3 text-lg text-text-secondary">Swipe right if you're interested in connecting with a developer, or swipe left to skip. When both developers swipe right, it's a match!</p>
                </div>
                <img src="../assets/matching-functionality.svg" alt="Matching Functionality" class="w-48 h-48 object-contain" />
              </div>
            </div>
            <!-- Feature 3: Messaging System -->
            <div
              ref="el => featureRefs.value[2] = el"
              :class="{ 'fade-in': isVisible[2] }"
              class="relative rounded-3xl bg-gradient-to-br from-success/5 to-success/10 p-8 shadow-lg ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform">
              <div class="flex items-center space-x-6">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/20">
                  <font-awesome-icon icon="comments" class="text-success text-2xl" />
                </div>
                <div class="flex-1">
                  <h3 class="text-2xl font-bold text-text-primary">Messaging System</h3>
                  <p class="mt-3 text-lg text-text-secondary">Once matched, instantly connect through our real-time messaging system. Send and receive messages with a simple text-based interface.</p>
                </div>
                <img src="../assets/messaging-system.svg" alt="Messaging System" class="w-48 h-48 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative isolate mt-24 px-6 py-28 sm:mt-36 sm:px-8 sm:py-36 lg:py-48">
      <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
        aria-hidden="true">
        <div class="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-primary to-secondary">
        </div>
      </div>
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Ready to find your perfect match?</h2>
        <p class="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
          Join thousands of developers who have found their ideal coding partners through DevMatch.
        </p>
        <div class="mt-10 flex justify-center gap-x-6">
          <button
            @click="navigateToLogin"
            class="rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20">
            Get Started
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-background pt-24 pb-16 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10"></div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-text-primary">DevMatch</h3>
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
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-text-primary">Resources</h3>
            <ul class="space-y-3">
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
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-text-primary">Company</h3>
            <ul class="space-y-3">
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
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-text-primary">Legal</h3>
            <ul class="space-y-3">
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
        <div class="mt-12 border-t border-gray-200/10 pt-8">
          <p class="text-center text-sm text-text-secondary">&copy; 2025 DevMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-in {
  opacity: 0;
  transform: translateX(-100px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.fade-in:nth-child(even) {
  transform: translateX(100px);
}

.visible {
  opacity: 1 !important;
  transform: translateX(0) !important;
}
</style>
