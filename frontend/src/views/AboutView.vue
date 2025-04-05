<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 sm:py-32">
      <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl">
        <div class="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-primary to-secondary"></div>
      </div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl fade-in" :class="{ 'show': isVisible }">
            About DevMatch
          </h1>
          <p class="mt-6 text-lg text-text-secondary fade-in" :class="{ 'show': isVisible }">
            Revolutionizing how developers connect, collaborate, and create together.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div class="fade-in" :class="{ 'show': isVisible }">
            <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Our Mission</h2>
            <p class="mt-4 text-lg text-text-secondary">
              At DevMatch, we believe in the power of collaboration. Our mission is to break down barriers in the developer
              community by creating meaningful connections between talented individuals who share common interests and goals.
            </p>
          </div>
          <div class="fade-in" :class="{ 'show': isVisible }">
            <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Our Vision</h2>
            <p class="mt-4 text-lg text-text-secondary">
              We envision a world where every developer can easily find their perfect coding partner, mentor, or team member.
              Through our platform, we're making this vision a reality, one match at a time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 sm:py-24 bg-card">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl fade-in" :class="{ 'show': isVisible }">
            Our Core Values
          </h2>
        </div>
        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Value 1 -->
          <div class="relative rounded-2xl bg-background p-6 shadow-sm gradient-border animate-on-scroll hover-scale">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-text-primary">Community First</h3>
            <p class="mt-2 text-text-secondary">We prioritize building a supportive and inclusive community where developers can thrive together.</p>
          </div>
          <!-- Value 2 -->
          <div class="relative rounded-2xl bg-background p-6 shadow-sm gradient-border animate-on-scroll hover-scale">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <svg class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-text-primary">Innovation</h3>
            <p class="mt-2 text-text-secondary">We continuously innovate our matching algorithms and platform features to create the best possible experience.</p>
          </div>
          <!-- Value 3 -->
          <div class="relative rounded-2xl bg-background p-6 shadow-sm gradient-border animate-on-scroll hover-scale">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <svg class="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-semibold text-text-primary">Trust & Security</h3>
            <p class="mt-2 text-text-secondary">We maintain the highest standards of trust and security in all our platform interactions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Join Us Section -->
    <section class="relative isolate mt-16 px-6 py-20 sm:mt-32 sm:px-8 md:py-32">
      <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl">
        <div class="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-primary to-secondary"></div>
      </div>
      <div class="mx-auto max-w-2xl text-center fade-in" :class="{ 'show': isVisible }">
        <h2 class="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Join Our Community</h2>
        <p class="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
          Be part of a growing community of developers who are reshaping the future of collaborative coding.
        </p>
        <div class="mt-10 flex justify-center gap-x-6">
          <button
            class="rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20">
            Get Started Today
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-background pt-16 pb-12 relative overflow-hidden">
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
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
