import { defineStore } from 'pinia'
import type { UserState, UserRegistrationData } from '../interfaces/interfaces'

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
