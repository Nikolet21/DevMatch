<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useUserStore } from '@/stores/userStore'
const UserDetailsModal = defineAsyncComponent(() => import('@/components/modals/UserDetailsModal.vue'))
const UserEditModal = defineAsyncComponent(() => import('@/components/modals/UserEditModal.vue'))
const UserStatusConfirmationModal = defineAsyncComponent(() => import('@/components/modals/UserStatusConfirmationModal.vue'))
import type { User } from '@/interfaces/interfaces'

// User store for admin functionality
const userStore = useUserStore()

// Initialize data
onMounted(async () => {
  await userStore.fetchAllUsers()
})

// User action modals
const showUserDetails = ref(false)
const showEditModal = ref(false)
const showStatusConfirmation = ref(false)
const statusAction = ref<'activate' | 'deactivate'>('deactivate')
const animatedElements = ref<HTMLElement[]>([])

// Methods
const viewUserDetails = (userId: string) => {
  userStore.selectAdminUser(userId)
  showUserDetails.value = true
}

const closeUserDetails = () => {
  showUserDetails.value = false
  setTimeout(() => {
    userStore.selectedAdminUser = null
  }, 200)
}

const openEditModal = (userId: string) => {
  userStore.selectAdminUser(userId)
  showEditModal.value = true
}

const handleEditModalClose = () => {
  showEditModal.value = false
}

const handleSaveUser = (userData: Partial<User>) => {
  if (userStore.selectedAdminUser && userStore.selectedAdminUser.id) {
    userStore.editUser(userStore.selectedAdminUser.id, userData)
    showEditModal.value = false
  }
}

const confirmStatusChange = (userId: string) => {
  const user = userStore.adminUsers.find(u => u.id === userId)
  if (user) {
    statusAction.value = user.status === 'Active' ? 'deactivate' : 'activate'
    userStore.selectAdminUser(userId)
    showStatusConfirmation.value = true
  }
}

const handleStatusConfirm = () => {
  if (userStore.selectedAdminUser) {
    const newStatus = statusAction.value === 'activate' ? 'Active' : 'Inactive'
    userStore.updateUserStatus(userStore.selectedAdminUser.id as string, newStatus)
    showStatusConfirmation.value = false
    
    // If user details modal is open, close it since the status has changed
    if (showUserDetails.value) {
      closeUserDetails()
    }
  }
}

const prevPage = () => {
  if (userStore.adminPagination.currentPage > 1) {
    userStore.setAdminPage(userStore.adminPagination.currentPage - 1)
  }
}

const nextPage = () => {
  if (userStore.adminPagination.currentPage < userStore.totalAdminPages) {
    userStore.setAdminPage(userStore.adminPagination.currentPage + 1)
  }
}

const resetFilters = () => {
  userStore.resetAdminFilters()
}

// Animation functionality
onMounted(() => {
  // Collect all elements with animate-on-scroll class
  animatedElements.value = Array.from(document.querySelectorAll('.animate-on-scroll'))
  
  // Initial check for elements in viewport
  setTimeout(() => {
    animatedElements.value.forEach(element => {
      element.classList.add('visible')
    })
  }, 100)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 -z-10"></div>
    
    <div class="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div class="animate-on-scroll opacity-0 translate-y-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Developer Management</h1>
        <p class="text-text-secondary mt-2">View and manage all registered developers and admins.</p>
      </div>

      <!-- Filters -->
      <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 mt-6 animate-on-scroll opacity-0 translate-y-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-grow">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                v-model="userStore.adminFilters.search"
                type="text"
                placeholder="Search by name or email..."
                class="block w-full rounded-lg pl-10 pr-3 py-3 bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 text-text-primary placeholder:text-gray-400 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <select
              v-model="userStore.adminFilters.status"
              class="rounded-lg bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 text-text-primary py-3 px-4 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              v-model="userStore.adminFilters.role"
              class="rounded-lg bg-white/50 shadow-sm ring-1 ring-inset ring-gray-300 text-text-primary py-3 px-4 transition-all duration-200 hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            >
              <option value="all">All Roles</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              @click="resetFilters"
              class="flex items-center justify-center gap-2 rounded-full bg-white/70 px-5 py-3 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/10 hover:bg-white transition-all duration-200 hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden animate-on-scroll opacity-0 translate-y-8">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200/70">
            <thead class="bg-gray-50/70">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white/20 divide-y divide-gray-200/70">
              <tr v-for="user in userStore.paginatedAdminUsers" :key="user.id" class="hover:bg-primary/5 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-sm">
                      <span class="text-primary text-sm font-medium">{{ (user.firstName?.[0] || '') + (user.lastName?.[0] || '') }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-text-primary">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm text-text-secondary">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs rounded-full capitalize" 
                    :class="{
                      'bg-primary/10 text-primary': user.role === 'admin',
                      'bg-secondary/10 text-secondary': user.role === 'developer' || user.role === 'user'
                    }">
                    {{ user.role === 'user' ? 'Developer' : user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': user.status === 'Active',
                      'bg-red-100 text-red-800': user.status === 'Inactive'
                    }">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    @click="viewUserDetails(user.id as string)"
                    class="text-primary hover:text-primary/80 transition-colors px-3 py-1 rounded-lg hover:bg-primary/5"
                  >
                    View
                  </button>
                  <button
                    @click="openEditModal(user.id as string)"
                    class="text-secondary hover:text-secondary/80 transition-colors px-3 py-1 rounded-lg hover:bg-secondary/5"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmStatusChange(user.id as string)"
                    :class="user.status === 'Active' 
                      ? 'text-red-600 hover:text-red-700 transition-colors px-3 py-1 rounded-lg hover:bg-red-50' 
                      : 'text-green-600 hover:text-green-700 transition-colors px-3 py-1 rounded-lg hover:bg-green-50'"
                  >
                    {{ user.status === 'Active' ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>

              <!-- Empty state when no users match filters -->
              <tr v-if="userStore.paginatedAdminUsers.length === 0">
                <td colspan="4" class="px-6 py-10 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-gray-700 font-medium">No users found</p>
                    <p class="text-gray-500 text-sm mt-1 max-w-md">Try adjusting your search or filter criteria</p>
                    <button
                      @click="resetFilters"
                      class="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
                    >
                      Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white/50 px-6 py-4 border-t border-gray-200/50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p class="text-sm text-text-secondary">
                Showing
                <span class="font-medium">{{ userStore.paginatedAdminUsers.length }}</span>
                of
                <span class="font-medium">{{ userStore.filteredAdminUsers.length }}</span>
                results
              </p>
            </div>
            <div v-if="userStore.totalAdminPages > 1">
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="prevPage"
                  :disabled="userStore.adminPagination.currentPage <= 1"
                  class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  :class="userStore.adminPagination.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>

                <button
                  v-for="pageNumber in userStore.totalAdminPages"
                  :key="pageNumber"
                  @click="userStore.setAdminPage(pageNumber)"
                  :class="[
                    userStore.adminPagination.currentPage === pageNumber ? 'z-10 bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors'
                  ]"
                >
                  {{ pageNumber }}
                </button>

                <button
                  @click="nextPage"
                  :disabled="userStore.adminPagination.currentPage >= userStore.totalAdminPages"
                  class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  :class="userStore.adminPagination.currentPage >= userStore.totalAdminPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal (Now using the dedicated component) -->
    <UserDetailsModal 
      :is-open="showUserDetails" 
      :user="userStore.selectedAdminUser"
      @close="closeUserDetails"
      @edit="openEditModal(userStore.selectedAdminUser?.id as string)"
      @toggle-status="confirmStatusChange(userStore.selectedAdminUser?.id as string)"
    />

    <!-- User Edit Modal (Now using the dedicated component) -->
    <UserEditModal 
      :is-open="showEditModal" 
      :user="userStore.selectedAdminUser"
      @close="handleEditModalClose"
      @save="handleSaveUser"
    />

    <!-- User Status Confirmation Modal -->
    <UserStatusConfirmationModal
      :is-open="showStatusConfirmation"
      :action="statusAction"
      :user="userStore.selectedAdminUser"
      @confirm="handleStatusConfirm"
      @cancel="showStatusConfirmation = false"
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
</style>
