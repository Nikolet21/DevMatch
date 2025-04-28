import { defineStore } from 'pinia'
import type { UserState, UserRegistrationData } from '../interfaces/interfaces'
import { mockUsers, mockDevelopers, defaultAvatar } from '../data/mockData'
import { useProfileStore } from './profileStore'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
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
    }
  }
})
