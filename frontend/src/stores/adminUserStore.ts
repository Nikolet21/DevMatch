import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockUsers, mockDevelopers } from '@/data/mockData'

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: Date;
  skills: string[];
  profileCompleted: boolean;
}

export const useAdminUserStore = defineStore('adminUser', () => {
  const users = ref<AdminUser[]>([])
  const selectedUser = ref<AdminUser | null>(null)
  const isLoading = ref(false)

  // Filter state
  const filters = ref({
    search: '',
    status: 'all',
    role: 'all'
  })

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Initialize users from mock data
  const initializeUsers = () => {
    isLoading.value = true

    // Create users from mockUsers data
    const usersFromRegistration = mockUsers.map((user, index) => ({
      id: index + 1,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: index === 0 ? 'admin' : 'user',
      status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)] as 'Active' | 'Inactive' | 'Pending',
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      skills: [],
      profileCompleted: Math.random() > 0.3
    }))

    // Add developers to the users list
    const developersAsUsers = mockDevelopers.map(dev => ({
      id: dev.id + 100, // To avoid ID conflicts
      name: dev.name,
      email: dev.email,
      role: 'developer',
      status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)] as 'Active' | 'Inactive' | 'Pending',
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
      skills: dev.skills,
      profileCompleted: true
    }))

    users.value = [...usersFromRegistration, ...developersAsUsers]
    isLoading.value = false
  }

  // Filtered users based on search and filters
  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      const matchesSearch = filters.value.search === '' ||
        user.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.value.search.toLowerCase())

      const matchesStatus = filters.value.status === 'all' || user.status === filters.value.status
      const matchesRole = filters.value.role === 'all' || user.role === filters.value.role

      return matchesSearch && matchesStatus && matchesRole
    })
  })

  // Paginated users
  const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return filteredUsers.value.slice(startIndex, endIndex)
  })

  // Total pages
  const totalPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1
  })

  // User actions
  const selectUser = (userId: number) => {
    selectedUser.value = users.value.find(user => user.id === userId) || null
  }

  const updateUserStatus = (userId: number, status: 'Active' | 'Inactive' | 'Pending') => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = status
    }
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      status: 'all',
      role: 'all'
    }
    currentPage.value = 1
  }

  return {
    users,
    selectedUser,
    isLoading,
    filters,
    currentPage,
    itemsPerPage,
    filteredUsers,
    paginatedUsers,
    totalPages,
    initializeUsers,
    selectUser,
    updateUserStatus,
    resetFilters
  }
})
