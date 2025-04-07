import { defineStore } from 'pinia'
import type { UserState, UserRegistrationData } from '../interfaces/interfaces'
import { mockUsers } from '../data/mockData'

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
        await new Promise(resolve => setTimeout(resolve, 1000))
        const mockUser = mockUsers.find(user => user.email === email && user.password === password)

        if (!mockUser) {
          throw new Error('Invalid credentials')
        }

        this.user = {
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email
        }
        this.isAuthenticated = true
        this.token = 'mock-token-' + Date.now()

        if (rememberMe) {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('user', JSON.stringify(this.user))
          sessionStorage.setItem('user', JSON.stringify(this.user))
        }
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
        this.user = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        }
        this.isAuthenticated = true
        this.token = 'dummy-token'
        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('user', JSON.stringify(this.user))
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
        this.token = token
        this.user = JSON.parse(storedUser)
        this.isAuthenticated = true
        return true
      }
      return false
    }
  }
})
