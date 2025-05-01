import { defineStore } from 'pinia'
import type { UserState, UserRegistrationData, User } from '../interfaces/interfaces'
import { mockUsers, mockDevelopers, defaultAvatar } from '../data/mockData'
import { useProfileStore } from './profileStore'

export const useUserStore = defineStore('user', {
  state: (): UserState & {
    adminUsers: User[];
    selectedAdminUser: User | null;
    adminLoading: boolean;
    adminFilters: {
      search: string;
      status: string;
      role: string;
    };
    adminPagination: {
      currentPage: number;
      itemsPerPage: number;
    };
  } => ({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
    // Admin state
    adminUsers: [],
    selectedAdminUser: null,
    adminLoading: false,
    adminFilters: {
      search: '',
      status: 'all',
      role: 'all'
    },
    adminPagination: {
      currentPage: 1,
      itemsPerPage: 10
    }
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    // Admin getters
    filteredAdminUsers: (state) => {
      return state.adminUsers.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        const matchesSearch = state.adminFilters.search === '' ||
          fullName.includes(state.adminFilters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(state.adminFilters.search.toLowerCase())

        const matchesStatus = state.adminFilters.status === 'all' || user.status === state.adminFilters.status
        const matchesRole = state.adminFilters.role === 'all' || user.role === state.adminFilters.role

        return matchesSearch && matchesStatus && matchesRole
      })
    },
    paginatedAdminUsers: (state) => {
      const filtered = state.adminUsers.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        const matchesSearch = state.adminFilters.search === '' ||
          fullName.includes(state.adminFilters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(state.adminFilters.search.toLowerCase())

        const matchesStatus = state.adminFilters.status === 'all' || user.status === state.adminFilters.status
        const matchesRole = state.adminFilters.role === 'all' || user.role === state.adminFilters.role

        return matchesSearch && matchesStatus && matchesRole
      })

      const startIndex = (state.adminPagination.currentPage - 1) * state.adminPagination.itemsPerPage
      const endIndex = startIndex + state.adminPagination.itemsPerPage
      return filtered.slice(startIndex, endIndex)
    },
    totalAdminPages: (state) => {
      const filtered = state.adminUsers.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase()
        const matchesSearch = state.adminFilters.search === '' ||
          fullName.includes(state.adminFilters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(state.adminFilters.search.toLowerCase())

        const matchesStatus = state.adminFilters.status === 'all' || user.status === state.adminFilters.status
        const matchesRole = state.adminFilters.role === 'all' || user.role === state.adminFilters.role

        return matchesSearch && matchesStatus && matchesRole
      })

      return Math.ceil(filtered.length / state.adminPagination.itemsPerPage) || 1
    }
  },

  actions: {
    async updateAvatar(avatarUrl: string) {
      try {
        // TODO: Implement API call to update avatar
        if (this.user) {
          this.user = {
            ...this.user,
            avatar: avatarUrl
          }
          // Update storage to persist avatar change
          const storage = localStorage.getItem('token') ? localStorage : sessionStorage
          const userData = JSON.parse(storage.getItem('user') || '{}')
          storage.setItem('user', JSON.stringify({ ...userData, avatar: avatarUrl }))
        }
      } catch (error) {
        this.error = 'Failed to update avatar'
        throw error
      }
    },

    async login(email: string, password: string, rememberMe: boolean = false) {
      this.loading = true
      this.error = null

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockUser = mockUsers.find(user => user.email === email && user.password === password)

        if (!mockUser) {
          throw new Error('Invalid credentials')
        }

        // Find the developer data from mockDevelopers
        const mockDeveloper = mockDevelopers.find(dev => dev.email === email)

        this.user = {
          id: 'currentUser',
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          avatar: mockDeveloper?.avatar || defaultAvatar
        }

        // Initialize profile with developer data if available
        const profileStore = useProfileStore()
        profileStore.setProfile({
          id: 'currentUser',
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email,
          skills: mockDeveloper?.skills || [],
          bio: mockDeveloper?.bio || '',
          githubUrl: mockDeveloper?.githubUrl,
          linkedinUrl: mockDeveloper?.linkedinUrl,
          album: []
        })
        this.isAuthenticated = true
        this.token = 'mock-token-' + Date.now()

        if (rememberMe) {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify({
            ...this.user,
            profile: {
              skills: mockDeveloper?.skills || [],
              bio: mockDeveloper?.bio || '',
              album: []
            }
          }))
        } else {
          sessionStorage.setItem('token', this.token)
          sessionStorage.setItem('user', JSON.stringify({
            ...this.user,
            profile: {
              skills: mockDeveloper?.skills || [],
              bio: mockDeveloper?.bio || '',
              album: []
            }
          }))
        }

        console.log("User logged in with ID:", this.user.id)
      } catch (error) {
        this.error = 'Invalid email or password'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: UserRegistrationData) {
      this.loading = true
      this.error = null

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockDeveloper = mockDevelopers.find(dev => dev.email === userData.email)
        this.user = {
          id: 'currentUser',
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatar: mockDeveloper?.avatar || defaultAvatar
        }
        this.isAuthenticated = true
        this.token = 'dummy-token'
        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('user', JSON.stringify(this.user))

        console.log("User registered with ID:", this.user.id)
      } catch (error) {
        this.error = 'Registration failed. Please try again.'
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },

    clearError() {
      this.error = null
    },

    async checkAuth() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

      if (token && storedUser) {
        const userData = JSON.parse(storedUser)
        this.token = token
        const mockDeveloper = mockDevelopers.find(dev => dev.email === userData.email)
        this.user = {
          id: 'currentUser',
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatar: mockDeveloper?.avatar || defaultAvatar
        }
        this.isAuthenticated = true

        // Initialize profile store with stored profile data
        const profileStore = useProfileStore()
        profileStore.setProfile({
          id: 'currentUser',
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          skills: userData.profile?.skills || [],
          bio: userData.profile?.bio || '',
          album: userData.profile?.album || []
        })

        // If we have a stored email and developer data, update the profile
        if (mockDeveloper) {
          // Update profile with any additional developer data
          profileStore.updateProfile({
            skills: mockDeveloper.skills || profileStore.profile?.skills || [],
            bio: mockDeveloper.bio || profileStore.profile?.bio || '',
            githubUrl: mockDeveloper.githubUrl || profileStore.profile?.githubUrl || '',
            linkedinUrl: mockDeveloper.linkedinUrl || profileStore.profile?.linkedinUrl || ''
          })
        }

        return true
      }
      return false
    },

    // Admin actions
    async fetchAllUsers() {
      this.adminLoading = true
      try {
        // In a real application, this would be an API call
        // For now, we'll use mock data
        this.adminUsers = [
          ...mockUsers.map((user, index) => ({
            id: String(index + 1),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: index === 0 ? 'admin' as const : 'user' as const,
            status: 'Active' as const,
            avatar: defaultAvatar
          })),
          ...mockDevelopers.map((dev, index) => ({
            id: String(mockUsers.length + index + 1),
            firstName: dev.name.split(' ')[0],
            lastName: dev.name.split(' ')[1] || '',
            email: dev.email,
            role: 'developer' as const,
            status: 'Active' as const,
            avatar: dev.avatar
          }))
        ]
      } catch (error) {
        console.error('Failed to fetch users:', error)
        this.error = 'Failed to load users'
      } finally {
        this.adminLoading = false
      }
    },

    selectAdminUser(userId: string) {
      this.selectedAdminUser = this.adminUsers.find(user => user.id === userId) || null
    },

    updateUserStatus(userId: string, status: 'Active' | 'Inactive') {
      const user = this.adminUsers.find(u => u.id === userId)
      if (user) {
        user.status = status
      }
    },

    updateUserRole(userId: string, role: 'admin' | 'user' | 'developer') {
      const user = this.adminUsers.find(u => u.id === userId)
      if (user) {
        user.role = role
      }
    },

    editUser(userId: string, userData: Partial<User>) {
      const userIndex = this.adminUsers.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        this.adminUsers[userIndex] = {
          ...this.adminUsers[userIndex],
          ...userData
        }
      }
    },

    resetAdminFilters() {
      this.adminFilters = {
        search: '',
        status: 'all',
        role: 'all'
      }
      this.adminPagination.currentPage = 1
    },

    setAdminFilter(filterType: 'search' | 'status' | 'role', value: string) {
      this.adminFilters[filterType] = value
      this.adminPagination.currentPage = 1
    },

    setAdminPage(page: number) {
      this.adminPagination.currentPage = page
    }
  }
})
