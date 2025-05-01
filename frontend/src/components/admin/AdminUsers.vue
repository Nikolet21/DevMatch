<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
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
const editForm = ref<Partial<User>>({})

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
  if (userStore.selectedAdminUser) {
    // Create edit form with appropriate field mappings
    editForm.value = {
      id: userStore.selectedAdminUser.id,
      firstName: userStore.selectedAdminUser.firstName,
      lastName: userStore.selectedAdminUser.lastName,
      email: userStore.selectedAdminUser.email,
      role: userStore.selectedAdminUser.role,
      status: userStore.selectedAdminUser.status
    }
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {}
}

const saveUserEdit = () => {
  if (userStore.selectedAdminUser && userStore.selectedAdminUser.id) {
    userStore.editUser(userStore.selectedAdminUser.id, editForm.value)
    closeEditModal()
  }
}

const toggleUserStatus = (userId: string) => {
  const user = userStore.adminUsers.find(u => u.id === userId)
  if (user) {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    userStore.updateUserStatus(userId, newStatus)
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
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <p class="text-gray-600 mt-1">View and manage all registered users.</p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
        <div class="flex flex-grow">
          <div class="relative flex-grow">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="userStore.adminFilters.search"
              type="text"
              placeholder="Search users..."
              class="block w-full rounded-lg border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <select
            v-model="userStore.adminFilters.status"
            class="rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            v-model="userStore.adminFilters.role"
            class="rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">All Roles</option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <button
            @click="resetFilters"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in userStore.paginatedAdminUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span class="text-primary text-sm font-medium">{{ (user.firstName?.[0] || '') + (user.lastName?.[0] || '') }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{{ user.role }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': user.status === 'Active',
                    'bg-red-100 text-red-800': user.status === 'Inactive'
                  }">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button
                  @click="viewUserDetails(user.id as string)"
                  class="text-primary hover:text-primary/80 transition-colors"
                >
                  View
                </button>
                <button
                  @click="openEditModal(user.id as string)"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="toggleUserStatus(user.id as string)"
                  class="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {{ user.status === 'Active' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>

            <!-- Empty state when no users match filters -->
            <tr v-if="userStore.paginatedAdminUsers.length === 0">
              <td colspan="4" class="px-6 py-8 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p class="text-gray-600 font-medium">No users found</p>
                  <p class="text-gray-500 text-sm mt-1">Try adjusting your search or filter criteria</p>
                  <button
                    @click="resetFilters"
                    class="mt-3 inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
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
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700">
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
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="userStore.adminPagination.currentPage <= 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'"
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
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                ]"
              >
                {{ pageNumber }}
              </button>

              <button
                @click="nextPage"
                :disabled="userStore.adminPagination.currentPage >= userStore.totalAdminPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="userStore.adminPagination.currentPage >= userStore.totalAdminPages ? 'cursor-not-allowed' : 'hover:bg-gray-50'"
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

    <!-- User Details Modal -->
    <div v-if="showUserDetails" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeUserDetails"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  User Details
                </h3>

                <div v-if="userStore.selectedAdminUser" class="space-y-4">
                  <div class="flex items-center">
                    <div class="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span class="text-primary text-lg font-medium">
                        {{ (userStore.selectedAdminUser.firstName?.[0] || '') + (userStore.selectedAdminUser.lastName?.[0] || '') }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-gray-900">
                        {{ userStore.selectedAdminUser.firstName }} {{ userStore.selectedAdminUser.lastName }}
                      </h4>
                      <p class="text-sm text-gray-500">{{ userStore.selectedAdminUser.email }}</p>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Role</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ userStore.selectedAdminUser.role }}</dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500">Status</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                          <span class="px-2 py-1 text-xs rounded-full"
                            :class="{
                              'bg-green-100 text-green-800': userStore.selectedAdminUser.status === 'Active',
                              'bg-red-100 text-red-800': userStore.selectedAdminUser.status === 'Inactive'
                            }">
                            {{ userStore.selectedAdminUser.status }}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div class="pt-4 flex justify-end space-x-3">
                    <button
                      @click="closeUserDetails"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      @click="openEditModal(userStore.selectedAdminUser.id as string)"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90"
                    >
                      Edit User
                    </button>
                    <button
                      @click="toggleUserStatus(userStore.selectedAdminUser.id as string)"
                      class="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700"
                    >
                      {{ userStore.selectedAdminUser.status === 'Active' ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeEditModal"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Edit User
                </h3>

                <div class="space-y-4">
                  <div v-if="userStore.selectedAdminUser" class="flex items-center mb-6">
                    <div class="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span class="text-primary text-lg font-medium">
                        {{ (userStore.selectedAdminUser.firstName?.[0] || '') + (userStore.selectedAdminUser.lastName?.[0] || '') }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-gray-900">
                        {{ userStore.selectedAdminUser.firstName }} {{ userStore.selectedAdminUser.lastName }}
                      </h4>
                      <p class="text-sm text-gray-500">{{ userStore.selectedAdminUser.email }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        id="firstName"
                        v-model="editForm.firstName"
                        type="text"
                        class="mt-1 block w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        id="lastName"
                        v-model="editForm.lastName"
                        type="text"
                        class="mt-1 block w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      v-model="editForm.email"
                      type="email"
                      class="mt-1 block w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        id="role"
                        v-model="editForm.role"
                        class="mt-1 block w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="developer">Developer</option>
                      </select>
                    </div>
                    <div>
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="status"
                        v-model="editForm.status"
                        class="mt-1 block w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="saveUserEdit"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save Changes
            </button>
            <button
              @click="closeEditModal"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
