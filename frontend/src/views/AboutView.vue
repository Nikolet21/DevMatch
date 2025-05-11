<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isHeaderVisible = ref(true)
const lastScrollPosition = ref(0)
const animatedElements = ref<HTMLElement[]>([])

const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  isHeaderVisible.value = currentScrollPosition < lastScrollPosition.value || currentScrollPosition < 50
  lastScrollPosition.value = currentScrollPosition
  
  // Check for elements in viewport to animate
  checkElementsInViewport()
}

const navigateToLanding = () => {
  router.push('/')
}

// Custom intersection observer implementation
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
  setTimeout(() => {
    checkElementsInViewport()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm"
      :class="{ 'translate-y-0 shadow-md': isHeaderVisible, '-translate-y-full': !isHeaderVisible }"
      :style="{ backgroundColor: 'rgba(249, 250, 251, ' + (lastScrollPosition > 50 ? '0.85' : '0.5') + ')' }">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevMatch</router-link>
          </div>
          <div class="hidden md:block">
            <div class="flex items-center space-x-8">
              <button
                @click="navigateToLanding"
                class="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-md">
                Back to Home
              </button>
            </div>
          </div>
          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button
              @click="navigateToLanding"
              class="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200">
              <span class="sr-only">Back to Home</span>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background z-0"></div>
      <div class="container mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="animate-on-scroll opacity-0 translate-y-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About DevMatch
          </h1>
          <p class="animate-on-scroll opacity-0 translate-y-8 mt-6 text-lg md:text-xl text-text-secondary leading-relaxed">
            Revolutionizing how developers connect, collaborate, and create together.
          </p>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-1/4 right-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl"></div>
    </section>

    <!-- Mission Section -->
    <section class="relative py-16 md:py-24">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-primary/10 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6">
              <svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-4">Our Mission</h2>
            <p class="text-text-secondary leading-relaxed">
              At DevMatch, we believe in the power of collaboration. Our mission is to break down barriers in the developer
              community by creating meaningful connections between talented individuals who share common interests and goals.
            </p>
            <p class="text-text-secondary leading-relaxed mt-4">
              We're committed to fostering an inclusive environment where developers of all skill levels can find their
              perfect match for projects, mentorship, or learning opportunities.
            </p>
          </div>
          
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg border border-secondary/10 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-6">
              <svg class="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 class="text-2xl md:text-3xl font-bold text-text-primary mb-4">Our Vision</h2>
            <p class="text-text-secondary leading-relaxed">
              We envision a world where every developer can easily find their perfect coding partner, mentor, or team member.
              Through our platform, we're making this vision a reality, one match at a time.
            </p>
            <p class="text-text-secondary leading-relaxed mt-4">
              By leveraging intelligent matching algorithms and creating a supportive community, we aim to become the
              go-to platform for developers seeking meaningful collaboration opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="relative py-16 md:py-24">
      <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-on-scroll opacity-0 translate-y-8">
            Our Core Values
          </h2>
          <p class="mt-4 text-lg text-text-secondary animate-on-scroll opacity-0 translate-y-8">
            The principles that guide everything we do at DevMatch
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <!-- Value 1 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-primary/10 hover:shadow-xl transition-all duration-300 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary">Community First</h3>
            <p class="mt-3 text-text-secondary">We prioritize building a supportive and inclusive community where developers can thrive together, share knowledge, and grow professionally.</p>
          </div>
          
          <!-- Value 2 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-secondary/10 hover:shadow-xl transition-all duration-300 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-6">
              <svg class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary">Innovation</h3>
            <p class="mt-3 text-text-secondary">We continuously innovate our matching algorithms and platform features to create the best possible experience for developers seeking their perfect match.</p>
          </div>
          
          <!-- Value 3 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-success/10 hover:shadow-xl transition-all duration-300 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center mb-6">
              <svg class="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-text-primary">Trust & Security</h3>
            <p class="mt-3 text-text-secondary">We maintain the highest standards of trust and security in all our platform interactions, ensuring a safe environment for developers to connect.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div class="container mx-auto max-w-5xl px-6 sm:px-8 relative z-10">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 lg:p-12 shadow-xl border border-primary/10">
          <div class="mx-auto max-w-3xl text-center">
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight text-text-primary sm:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-on-scroll opacity-0 translate-y-8">Join Our Community</h2>
            <p class="mx-auto mt-4 md:mt-6 max-w-xl text-base md:text-lg text-text-secondary animate-on-scroll opacity-0 translate-y-8">
              Be part of a growing community of developers who are reshaping the future of collaborative coding.
            </p>
            <div class="mt-8 md:mt-10 flex justify-center">
              <button
                @click="navigateToLanding"
                class="rounded-full bg-primary px-6 md:px-8 py-3 md:py-4 text-base font-semibold text-white shadow-md hover:shadow-xl hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1 animate-on-scroll opacity-0 translate-y-8">
                Get Started Today
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
</style>
