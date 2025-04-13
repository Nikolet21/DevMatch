<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent, computed } from 'vue'
import defaultAvatar from '../assets/default-avatar.svg'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const DashboardSection = defineAsyncComponent(() => import('../components/DashboardSection.vue'))
const MatchCards = defineAsyncComponent(() => import('../components/MatchCards.vue'))
const MatchesSection = defineAsyncComponent(() => import('../components/MatchesSection.vue'))
const ChatSection = defineAsyncComponent(() => import('../components/ChatSection.vue'))
const ChatRoom = defineAsyncComponent(() => import('../components/ChatRoom.vue'))
const SignOutModal = defineAsyncComponent(() => import('../components/modals/SignOutModal.vue'))

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('dashboard')
const isSidebarCollapsed = ref(window.innerWidth < 1024)
const showNotifications = ref(false)
const showProfileMenu = ref(false)
const showSignOutModal = ref(false)

const currentUser = computed(() => userStore.currentUser)

const notifications = ref([
  { id: 1, title: 'New Match!', message: 'You have a new match with Sarah Developer', unread: true },
  { id: 2, title: 'Message Received', message: 'John Smith sent you a message', unread: true },
  { id: 3, title: 'Profile View', message: 'Someone viewed your profile', unread: false }
])

const handleResize = () => {
  isSidebarCollapsed.value = window.innerWidth < 1024
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) showProfileMenu.value = false
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
  if (showProfileMenu.value) showNotifications.value = false
}

const navigateToProfile = () => {
  router.push('/profile')
  showProfileMenu.value = false
}

const navigateToSettings = () => {
  router.push('/settings')
  showProfileMenu.value = false
}

const handleLogout = () => {
  showSignOutModal.value = true
  showProfileMenu.value = false
}

const confirmLogout = () => {
  userStore.logout()
  router.push('/login')
  showSignOutModal.value = false
}

const cancelLogout = () => {
  showSignOutModal.value = false
}

const updateActiveTab = (newTab: string) => {
  activeTab.value = newTab
}

const closeDropdowns = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notifications-dropdown') && !target.closest('.profile-dropdown')) {
    showNotifications.value = false
    showProfileMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', closeDropdowns)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', closeDropdowns)
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
            <div class="relative notifications-dropdown">
              <button
                @click="toggleNotifications"
                class="group relative rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105">
                <span class="sr-only">Notifications</span>
                <font-awesome-icon icon="bell" class="h-6 w-6" />
                <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <!-- Notifications Dropdown -->
              <div v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                <div class="px-4 py-2 border-b border-gray-100">
                  <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div v-for="notification in notifications" :key="notification.id"
                    class="px-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <div class="flex items-start space-x-3">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900 flex items-center">
                          {{ notification.title }}
                          <span v-if="notification.unread"
                            class="ml-2 h-2 w-2 rounded-full bg-primary"></span>
                        </p>
                        <p class="text-sm text-gray-500 mt-0.5">{{ notification.message }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-gray-100">
                  <button class="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>

            <div class="relative profile-dropdown">
              <button
                @click="toggleProfileMenu"
                class="group relative rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105">
                <span class="sr-only">Profile</span>
                <img :src="currentUser?.avatar || defaultAvatar" alt="Profile"
                  class="h-6 w-6 rounded-full" />
              </button>
              <!-- Profile Dropdown -->
              <div v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                <div class="px-4 py-2 border-b border-gray-100">
                  <p class="text-sm font-medium text-gray-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
                </div>
                <div class="py-1">
                  <button @click="navigateToProfile"
                    class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Your Profile
                  </button>
                  <button @click="navigateToSettings"
                    class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    Settings
                  </button>
                  <button @click="handleLogout"
                    class="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 transition-colors duration-200">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
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

            <div class="flex flex-col h-full p-4">
              <div class="flex-grow space-y-1">
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
                <button @click="activeTab = 'browse'"
                  class="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  :class="{ 'justify-center px-2': isSidebarCollapsed, 'bg-primary/10 text-primary': activeTab === 'browse' }">
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
              </div>

              <!-- Profile Info and Settings at Bottom -->
              <div class="mt-auto space-y-4">
                <div v-if="!isSidebarCollapsed" class="border-t border-gray-100 pt-4">
                  <div class="flex items-center space-x-3 px-3 py-2">
                    <img :src="currentUser?.avatar || defaultAvatar" alt="Profile" class="w-10 h-10 rounded-full" />
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-medium text-text-primary truncate">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h3>
                      <p class="text-xs text-text-secondary truncate">{{ currentUser?.email }}</p>
                    </div>
                  </div>
                </div>
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
            <div v-if="activeTab === 'chats'" class="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[1600px] mx-auto">
              <ChatSection v-model:activeTab="activeTab" />
              <ChatRoom />
            </div>
            <DashboardSection
              v-else-if="activeTab === 'dashboard'"
              v-model="activeTab"
              @update:activeTab="updateActiveTab"
            />
            <MatchCards v-else-if="activeTab === 'browse'" :isSidebarCollapsed="isSidebarCollapsed" />
            <MatchesSection v-else-if="activeTab === 'matches'" v-model:activeTab="activeTab" />
          </div>
        </div>
      </div>
    </main>
  </div>
  <SignOutModal v-if="showSignOutModal" @confirm="confirmLogout" @cancel="cancelLogout" />
</template>
