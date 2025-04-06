<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const DashboardSection = defineAsyncComponent(() => import('@/components/DashboardSection.vue'))
const MatchCards = defineAsyncComponent(() => import('@/components/MatchCards.vue'))
const MatchesSection = defineAsyncComponent(() => import('@/components/MatchesSection.vue'))
const ChatSection = defineAsyncComponent(() => import('@/components/ChatSection.vue'))

const router = useRouter()
const activeTab = ref('dashboard')
const isSidebarCollapsed = ref(window.innerWidth < 1024)

const handleResize = () => {
  isSidebarCollapsed.value = window.innerWidth < 1024
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const navigateToProfile = () => {
  router.push('/profile')
}

const navigateToSettings = () => {
  router.push('/settings')
}

const logout = () => {
  // TODO: Implement logout logic
  router.push('/')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header/Navigation -->
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/95 to-primary/80 backdrop-blur-sm shadow-lg">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center space-x-8">
            <a href="#" class="text-2xl font-bold text-white hover:text-white/90 transition-colors duration-200">DevMatch</a>
            <div class="hidden md:flex space-x-6">
              <button
                @click="activeTab = 'matches'"
                class="text-white/80 hover:text-white transition-colors duration-200"
                :class="{ 'text-white font-semibold': activeTab === 'matches' }">
                Matches
              </button>
              <button
                @click="activeTab = 'chats'"
                class="text-white/80 hover:text-white transition-colors duration-200"
                :class="{ 'text-white font-semibold': activeTab === 'chats' }">
                Chats
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <button
              @click="navigateToProfile"
              class="group relative rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105">
              <span class="sr-only">Profile</span>
              <font-awesome-icon icon="user" class="h-6 w-6" />
              <span
                class="absolute -bottom-8 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">Profile</span>
            </button>
            <button @click="logout"
              class="group relative rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200 hover:scale-105">
              <span>Logout</span>
              <span
                class="absolute -bottom-8 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">Sign
                Out</span>
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="pt-24 pb-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex">
          <!-- Sidebar -->
          <aside
            class="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-sm border-r border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden"
            :class="isSidebarCollapsed ? 'w-16' : 'w-64'">
            <!-- Toggle Button -->
            <button @click="toggleSidebar"
              class="absolute -right-3 top-4 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 z-10">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isSidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            <div class="p-4 space-y-6">
              <div class="space-y-1">
                <h2 class="text-lg font-semibold text-text-primary flex items-center space-x-2 mb-4"
                  :class="{ 'justify-center': isSidebarCollapsed }">
                  <font-awesome-icon icon="bolt" class="w-5 h-5 text-primary" />
                  <span v-if="!isSidebarCollapsed" class="truncate">Quick Actions</span>
                </h2>
                <button @click="activeTab = 'dashboard'"
                  class="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  :class="{ 'justify-center px-2': isSidebarCollapsed, 'bg-primary/10 text-primary': activeTab === 'dashboard' }">
                  <font-awesome-icon icon="bars" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="truncate">Dashboard</span>
                </button>
                <button @click="activeTab = 'match-cards'"
                  class="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  :class="{ 'justify-center px-2': isSidebarCollapsed, 'bg-primary/10 text-primary': activeTab === 'match-cards' }">
                  <font-awesome-icon icon="users" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="truncate">Find Matches</span>
                </button>
                <button @click="activeTab = 'matches'"
                  class="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  :class="{ 'justify-center px-2': isSidebarCollapsed, 'bg-primary/10 text-primary': activeTab === 'matches' }">
                  <font-awesome-icon icon="users" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="truncate">Matched Developers</span>
                </button>
                <button @click="activeTab = 'chats'"
                  class="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  :class="{ 'justify-center px-2': isSidebarCollapsed, 'bg-primary/10 text-primary': activeTab === 'chats' }">
                  <font-awesome-icon icon="comments" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="truncate">Active Chats</span>
                </button>
                <button @click="navigateToSettings"
                  class="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  :class="{ 'justify-center px-2': isSidebarCollapsed }">
                  <font-awesome-icon icon="cog" class="w-5 h-5 flex-shrink-0" />
                  <span v-if="!isSidebarCollapsed" class="truncate">Settings</span>
                </button>
              </div>
            </div>
          </aside>

          <!-- Main Content Area -->
          <div class="flex-1" :class="{ 'ml-20': isSidebarCollapsed, 'ml-72': !isSidebarCollapsed }">
            <Suspense>
              <template #default>
                <DashboardSection v-if="activeTab === 'dashboard'" />
                <MatchCards v-else-if="activeTab === 'match-cards'" />
                <MatchesSection v-else-if="activeTab === 'matches'" />
                <ChatSection v-else-if="activeTab === 'chats'" />
              </template>
              <template #fallback>
                <div class="flex items-center justify-center h-64">
                  <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              </template>
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
