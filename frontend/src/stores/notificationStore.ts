import { defineStore } from 'pinia'
import type { Notification, NotificationState } from '../interfaces/interfaces'
import { mockNotifications } from '../data/mockData'

const generateId = () => `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`

const initialUnreadCount = mockNotifications.filter(notification => !notification.read).length

// Default duration for each notification type
const DEFAULT_DURATIONS = {
  info: 3000,
  success: 4000,
  warning: 5000,
  error: 6000
}

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [...mockNotifications],
    unreadCount: initialUnreadCount,
    showToast: false,
    currentToast: null,
    notificationQueue: [],
    processingQueue: false
  }),

  getters: {
    allNotifications: (state) => state.notifications,
    unreadNotifications: (state) => state.notifications.filter(notification => !notification.read),
    hasUnread: (state) => state.unreadCount > 0
  },

  actions: {
    addNotification(notification: Partial<Notification>, displayDuration?: number) {
      const newNotification: Notification = {
        id: generateId(),
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        read: false,
        timestamp: new Date(),
        link: notification.link || '/notifications'
      }

      // Add to permanent notifications list
      this.notifications.unshift(newNotification)
      this.unreadCount++

      // Add customized display duration as a non-enumerable property
      Object.defineProperty(newNotification, 'displayDuration', {
        value: displayDuration || DEFAULT_DURATIONS[newNotification.type] || 5000,
        enumerable: false
      })

      // Add to queue and process if not already processing
      this.queueNotification(newNotification)

      return newNotification.id
    },

    queueNotification(notification: Notification) {
      this.notificationQueue.push(notification)

      // Start processing the queue if not already processing
      if (!this.processingQueue) {
        this.processNotificationQueue()
      }
    },

    async processNotificationQueue() {
      if (this.notificationQueue.length === 0) {
        this.processingQueue = false
        return
      }

      this.processingQueue = true

      // Get the next notification
      const nextNotification = this.notificationQueue.shift()
      if (!nextNotification) {
        this.processingQueue = false
        return
      }

      // Show this notification
      this.currentToast = nextNotification
      this.showToast = true

      // Wait for the duration
      const duration = (nextNotification as any).displayDuration || 3000

      // Use Promise and setTimeout for cleaner async handling
      await new Promise(resolve => setTimeout(resolve, duration))

      // Hide the current toast if it's still the one we displayed
      if (this.currentToast?.id === nextNotification.id) {
        this.showToast = false
        this.currentToast = null

        // Shorter delay before showing the next notification for faster transitions
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // Process the next notification in the queue
      this.processNotificationQueue()
    },

    notify(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', link?: string, duration?: number) {
      return this.addNotification({ title, message, type, link }, duration)
    },

    success(title: string, message: string, link?: string, duration?: number) {
      return this.notify(title, message, 'success', link, duration)
    },

    error(title: string, message: string, link?: string, duration?: number) {
      return this.notify(title, message, 'error', link, duration)
    },

    warning(title: string, message: string, link?: string, duration?: number) {
      return this.notify(title, message, 'warning', link, duration)
    },

    info(title: string, message: string, link?: string, duration?: number) {
      return this.notify(title, message, 'info', link, duration)
    },

    markAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadCount--
      }
    },

    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true
      })
      this.unreadCount = 0
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        const notification = this.notifications[index]
        this.notifications.splice(index, 1)
        if (!notification.read) {
          this.unreadCount--
        }
      }
    },

    clearAllNotifications() {
      this.notifications = []
      this.unreadCount = 0
    },

    hideToast() {
      this.showToast = false
      this.currentToast = null
    }
  }
})
