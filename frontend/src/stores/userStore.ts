import { defineStore } from 'pinia'

interface User {
  id?: string
  firstName?: string
  lastName?: string
  email: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  error: string | null
}

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
    async login(email: string, password: string, rememberMe: boolean = false) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate successful login
        this.user = { email }
        this.isAuthenticated = true
        this.token = 'dummy-token'

        if (rememberMe) {
          localStorage.setItem('token', this.token)
        } else {
          sessionStorage.setItem('token', this.token)
        }
      } catch (error) {
        this.error = 'Invalid email or password'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: {
      firstName: string
      lastName: string
      email: string
      password: string
    }) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulate successful registration
        this.user = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        }
        this.isAuthenticated = true
        this.token = 'dummy-token'
        sessionStorage.setItem('token', this.token)
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
      sessionStorage.removeItem('token')
    },

    clearError() {
      this.error = null
    }
  }
})
