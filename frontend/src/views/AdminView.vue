<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

// Load components asynchronously
const AdminDashboard = defineAsyncComponent(() => import('@/components/admin/AdminDashboard.vue'))
const AdminUsers = defineAsyncComponent(() => import('@/components/admin/AdminUsers.vue'))
const AdminReports = defineAsyncComponent(() => import('@/components/admin/AdminReports.vue'))

const router = useRouter()
const activeSection = ref<AdminSection>('dashboard')
const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)

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

const handleLogout = () => {
  localStorage.removeItem('adminAuthenticated')
  sessionStorage.removeItem('adminAuthenticated')
  localStorage.removeItem('adminEmail')
  sessionStorage.removeItem('adminEmail')
  localStorage.removeItem('adminName')
  sessionStorage.removeItem('adminName')
  router.push('/admin-portal')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Top Navigation -->
    <div class="lg:hidden">
      <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center space-x-2">
            <button
              @click="toggleSidebar"
              class="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span class="text-xl font-bold text-primary">DevMatch Admin</span>
          </div>

          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-if="isMobileMenuOpen" class="bg-white shadow-md border-t border-gray-100 py-2 px-4">
          <button
            @click="setActiveSection('dashboard')"
            class="w-full text-left py-2 px-4 rounded-md transition-colors duration-200"
            :class="activeSection === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'"
          >
            Dashboard
          </button>
          <button
            @click="setActiveSection('users')"
            class="w-full text-left py-2 px-4 rounded-md transition-colors duration-200"
            :class="activeSection === 'users' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'"
          >
            Users
          </button>
          <button
            @click="setActiveSection('reports')"
            class="w-full text-left py-2 px-4 rounded-md transition-colors duration-200"
            :class="activeSection === 'reports' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'"
          >
            Reports
          </button>
          <button
            @click="handleLogout"
            class="w-full text-left py-2 px-4 rounded-md text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Header -->
    <header class="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div class="h-16 px-6 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span class="text-xl font-bold text-primary">DevMatch Admin Portal</span>
        </div>

        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-700 font-medium">
            Admin
          </div>
          <button
            @click="handleLogout"
            class="px-3 py-1.5 rounded-md text-sm text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-30 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 transform"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20',
        'w-64'
      ]"
    >
      <div class="h-16 flex items-center px-6 border-b border-gray-200 lg:justify-center">
        <span class="text-xl font-bold text-primary lg:hidden">DevMatch Admin</span>
        <span class="hidden lg:block text-xl font-bold text-primary" v-if="!isSidebarOpen">DM</span>
      </div>

      <div class="py-4 flex flex-col h-[calc(100vh-4rem)]">
        <div class="px-3 space-y-1">
          <button
            @click="setActiveSection('dashboard')"
            class="w-full flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200"
            :class="activeSection === 'dashboard' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen }" class="ml-3">Dashboard</span>
          </button>

          <button
            @click="setActiveSection('users')"
            class="w-full flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200"
            :class="activeSection === 'users' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen }" class="ml-3">Users</span>
          </button>

          <button
            @click="setActiveSection('reports')"
            class="w-full flex items-center py-2.5 px-3 rounded-lg transition-colors duration-200"
            :class="activeSection === 'reports' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen }" class="ml-3">Reports</span>
          </button>
        </div>

        <div class="mt-auto px-3">
          <button
            @click="handleLogout"
            class="w-full flex items-center py-2.5 px-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span :class="{ 'lg:hidden': !isSidebarOpen }" class="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 transition-opacity lg:hidden"
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
  </div>
</template>
