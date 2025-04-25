import { defineStore } from 'pinia'
import type { PrivacyState } from '@/interfaces/interfaces'
import { useNotificationStore } from './notificationStore'
import { useActivityLogger } from '@/composables/useActivityLogger'
import { useActivityStore } from '@/stores/activityStore'

export const usePrivacyStore = defineStore('privacy', {
  state: (): PrivacyState => ({
    mutedUsers: [],
    blockedUsers: [],
    isLoading: false,
    error: null,
    successMessage: null
  }),

  getters: {
    getMutedUsers: (state) => state.mutedUsers,
    getBlockedUsers: (state) => state.blockedUsers,
    getIsLoading: (state) => state.isLoading,
    getError: (state) => state.error,
    getSuccessMessage: (state) => state.successMessage,
    isUserMuted: (state) => (userId: string) => state.mutedUsers.includes(userId),
    isUserBlocked: (state) => (userId: string) => state.blockedUsers.includes(userId)
  },

  actions: {
    async muteUser(userId: string, userName: string) {
      try {
        this.isLoading = true
        this.error = null

        if (this.mutedUsers.includes(userId)) {
          this.successMessage = `${userName} is already muted`
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        this.mutedUsers.push(userId)
        this.successMessage = `${userName} has been muted`

        // Log the mute action directly with the activity store
        const activityStore = useActivityStore()
        activityStore.logActivity('User Muted', { userName, userId })

        const notificationStore = useNotificationStore()
        notificationStore.info(
          'User Muted',
          `You will no longer receive notifications from ${userName}.`
        )

        this.savePrivacySettings()

      } catch (err) {
        this.error = 'Failed to mute user. Please try again.'
        console.error('Error muting user:', err)

        const notificationStore = useNotificationStore()
        notificationStore.error(
          'Mute Failed',
          'Failed to mute user. Please try again later.'
        )
      } finally {
        this.isLoading = false

        if (this.successMessage) {
          setTimeout(() => {
            this.successMessage = null
          }, 3000)
        }
      }
    },

    async unmuteUser(userId: string, userName: string) {
      try {
        this.isLoading = true
        this.error = null

        if (!this.mutedUsers.includes(userId)) {
          this.successMessage = `${userName} is not muted`
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        this.mutedUsers = this.mutedUsers.filter(id => id !== userId)
        this.successMessage = `${userName} has been unmuted`

        // Log the unmute action directly with the activity store
        const activityStore = useActivityStore()
        activityStore.logActivity('User Unmuted', { userName, userId })

        const notificationStore = useNotificationStore()
        notificationStore.info(
          'User Unmuted',
          `You will now receive notifications from ${userName}.`
        )

        this.savePrivacySettings()

      } catch (err) {
        this.error = 'Failed to unmute user. Please try again.'
        console.error('Error unmuting user:', err)

        const notificationStore = useNotificationStore()
        notificationStore.error(
          'Unmute Failed',
          'Failed to unmute user. Please try again later.'
        )
      } finally {
        this.isLoading = false

        if (this.successMessage) {
          setTimeout(() => {
            this.successMessage = null
          }, 3000)
        }
      }
    },

    async blockUser(userId: string, userName: string) {
      try {
        this.isLoading = true
        this.error = null

        if (this.blockedUsers.includes(userId)) {
          this.successMessage = `${userName} is already blocked`
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        this.blockedUsers.push(userId)
        this.successMessage = `${userName} has been blocked`

        // Log the block action directly with the activity store
        const activityStore = useActivityStore()
        activityStore.logActivity('User Blocked', { userName, userId })

        const notificationStore = useNotificationStore()
        notificationStore.warning(
          'User Blocked',
          `${userName} has been blocked and can no longer interact with you.`
        )

        this.savePrivacySettings()

      } catch (err) {
        this.error = 'Failed to block user. Please try again.'
        console.error('Error blocking user:', err)

        const notificationStore = useNotificationStore()
        notificationStore.error(
          'Block Failed',
          'Failed to block user. Please try again later.'
        )
      } finally {
        this.isLoading = false

        if (this.successMessage) {
          setTimeout(() => {
            this.successMessage = null
          }, 3000)
        }
      }
    },

    async unblockUser(userId: string, userName: string) {
      try {
        this.isLoading = true
        this.error = null

        if (!this.blockedUsers.includes(userId)) {
          this.successMessage = `${userName} is not blocked`
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        this.blockedUsers = this.blockedUsers.filter(id => id !== userId)
        this.successMessage = `${userName} has been unblocked`

        // Log the unblock action directly with the activity store
        const activityStore = useActivityStore()
        activityStore.logActivity('User Unblocked', { userName, userId })

        const notificationStore = useNotificationStore()
        notificationStore.info(
          'User Unblocked',
          `${userName} has been unblocked and can now interact with you.`
        )

        this.savePrivacySettings()

      } catch (err) {
        this.error = 'Failed to unblock user. Please try again.'
        console.error('Error unblocking user:', err)

        const notificationStore = useNotificationStore()
        notificationStore.error(
          'Unblock Failed',
          'Failed to unblock user. Please try again later.'
        )
      } finally {
        this.isLoading = false

        if (this.successMessage) {
          setTimeout(() => {
            this.successMessage = null
          }, 3000)
        }
      }
    },

    clearMessages() {
      this.error = null
      this.successMessage = null
    },

    loadPrivacySettings() {
      try {
        const storedMutedUsers = localStorage.getItem('mutedUsers')
        const storedBlockedUsers = localStorage.getItem('blockedUsers')

        if (storedMutedUsers) {
          this.mutedUsers = JSON.parse(storedMutedUsers)
        }

        if (storedBlockedUsers) {
          this.blockedUsers = JSON.parse(storedBlockedUsers)
        }
      } catch (err) {
        console.error('Failed to load privacy settings from localStorage:', err)
      }
    },

    // Save to localStorage for now, will be replaced with API calls
    savePrivacySettings() {
      try {
        localStorage.setItem('mutedUsers', JSON.stringify(this.mutedUsers))
        localStorage.setItem('blockedUsers', JSON.stringify(this.blockedUsers))
      } catch (err) {
        console.error('Failed to save privacy settings to localStorage:', err)
      }
    }
  }
})

// Initialize the store when imported
const privacyStore = usePrivacyStore()
privacyStore.loadPrivacySettings()
