<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

// Load components asynchronously
const AdminDashboard = defineAsyncComponent(() => import('@/components/admin/AdminDashboard.vue'))
const AdminUsers = defineAsyncComponent(() => import('@/components/admin/AdminUsers.vue'))
const AdminReports = defineAsyncComponent(() => import('@/components/admin/AdminReports.vue'))
const SignOutModal = defineAsyncComponent(() => import('@/components/modals/SignOutModal.vue'))

const router = useRouter()
const activeSection = ref<AdminSection>('dashboard')
const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const showSignOutModal = ref(false)

// Define section type
type AdminSection = 'dashboard' | 'users' | 'reports';

// Check admin authentication
onMounted(() => {
  const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true' ||
                               sessionStorage.getItem('adminAuthenticated') === 'true'
  if (!isAdminAuthenticated) {
    router.push('/admin-login')
    return
  }
  // Handle responsive sidebar
  const handleResize = () => {
    isSidebarOpen.value = window.innerWidth >= 1024
  }

  window.addEventListener('resize', handleResize)
  handleResize()

  return () => {
    window.removeEventListener('resize', handleResize)
  }
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const setActiveSection = (section: AdminSection) => {
  activeSection.value = section
  isMobileMenuOpen.value = false
}

const openSignOutModal = () => {
  showSignOutModal.value = true
}

const handleSignOutConfirm = () => {
  localStorage.removeItem('adminAuthenticated')
  sessionStorage.removeItem('adminAuthenticated')
  localStorage.removeItem('adminEmail')
  sessionStorage.removeItem('adminEmail')
  localStorage.removeItem('adminName')
  sessionStorage.removeItem('adminName')
  router.push('/')
}

const handleSignOutCancel = () => {
  showSignOutModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Background gradient effect -->
    <div class="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 -z-10"></div>
    
    <!-- Mobile Top Navigation -->
    <div class="lg:hidden">
      <div class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center space-x-3">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevMatch Admin</span>
          </div>

          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation Menu -->
        <div 
          v-if="isMobileMenuOpen" 
          class="bg-white/90 backdrop-blur-md shadow-md border-t border-gray-100/70 py-2 px-4 animate-fadeIn"
        >
          <button
            @click="setActiveSection('dashboard')"
            class="w-full flex items-center py-3 px-4 rounded-xl transition-colors duration-200 my-1"
            :class="activeSection === 'dashboard' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Dashboard
          </button>
          <button
            @click="setActiveSection('users')"
            class="w-full flex items-center py-3 px-4 rounded-xl transition-colors duration-200 my-1"
            :class="activeSection === 'users' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </button>
          <button
            @click="setActiveSection('reports')"
            class="w-full flex items-center py-3 px-4 rounded-xl transition-colors duration-200 my-1"
            :class="activeSection === 'reports' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 hover:bg-gray-50'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </button>
          <div class="border-t border-gray-100 my-2"></div>
          <button
            @click="openSignOutModal"
            class="w-full flex items-center py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 transition-colors duration-200 my-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Header -->
    <header class="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200/50">
      <div class="h-16 px-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">DevMatch Admin Portal</span>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-sm text-text-secondary font-medium">
            Admin Portal
          </div>
          <button
            @click="openSignOutModal"
            class="px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 border border-red-100 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-30 bg-white/90 backdrop-blur-md shadow-xl border-r border-gray-200/50 transition-all duration-300 transform"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20',
        'w-72 lg:w-64'
      ]"
    >
      <div class="h-16 flex items-center px-6 border-b border-gray-200/50 lg:justify-center">
        <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent lg:hidden">DevMatch Admin</span>
        <span class="hidden lg:block text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" v-if="!isSidebarOpen">DM</span>
      </div>

      <div class="py-6 flex flex-col h-[calc(100vh-4rem)]">
        <div class="px-4 space-y-2">
          <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-1">Main</h3>
          <button
            @click="setActiveSection('dashboard')"
            class="w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200"
            :class="activeSection === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen, 'ml-3 font-medium': true }">Dashboard</span>
          </button>

          <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mt-6 mb-1">Management</h3>
          <button
            @click="setActiveSection('users')"
            class="w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200"
            :class="activeSection === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen, 'ml-3 font-medium': true }">Users</span>
          </button>

          <button
            @click="setActiveSection('reports')"
            class="w-full flex items-center py-3 px-4 rounded-xl transition-all duration-200"
            :class="activeSection === 'reports' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen, 'ml-3 font-medium': true }">Reports</span>
          </button>
        </div>

        <div class="mt-auto px-4">
          <div class="px-3 py-3">
            <div class="border-t border-gray-200/70 pt-4 pb-2">
              <div class="flex items-center px-2" v-if="isSidebarOpen">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span class="text-primary text-sm font-medium">AD</span>
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-text-primary">Admin User</p>
                  <p class="text-xs text-text-secondary">admin@devmatch.com</p>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="openSignOutModal"
            class="w-full flex items-center py-3 px-4 rounded-xl text-red-500 border border-red-100 hover:bg-red-50 transition-all duration-200 mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen, 'ml-3': true }">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 transition-opacity lg:hidden backdrop-blur-sm"
    ></div>

    <!-- Main Content -->
    <main
      class="transition-all duration-300"
      :class="[
        'pt-16',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      ]"
    >
      <div class="p-4 sm:p-6 lg:p-8">
        <!-- Dynamic component based on active section -->
        <AdminDashboard v-if="activeSection === 'dashboard'" />
        <AdminUsers v-if="activeSection === 'users'" />
        <AdminReports v-if="activeSection === 'reports'" />
      </div>
    </main>

    <!-- SignOut Modal -->
    <SignOutModal 
      v-if="showSignOutModal" 
      @confirm="handleSignOutConfirm"
      @cancel="handleSignOutCancel"
    />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
