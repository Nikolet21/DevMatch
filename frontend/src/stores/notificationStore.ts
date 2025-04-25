import { defineStore } from 'pinia'
import type { Notification, NotificationState } from '../interfaces/interfaces'
import { mockNotifications } from '../data/mockData'

const generateId = () => `notification-${Date.now()}-${Math.floor(Math.random() * 10000)}`

const initialUnreadCount = mockNotifications.filter(notification => !notification.read).length

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [...mockNotifications],
    unreadCount: initialUnreadCount,
    showToast: false,
    currentToast: null
  }),

  getters: {
    allNotifications: (state) => state.notifications,
    unreadNotifications: (state) => state.notifications.filter(notification => !notification.read),
    hasUnread: (state) => state.unreadCount > 0
  },

  actions: {
    addNotification(notification: Partial<Notification>) {
      const newNotification: Notification = {
        id: generateId(),
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        read: false,
        timestamp: new Date(),
        link: '/notifications'
      }

      this.notifications.unshift(newNotification)
      this.unreadCount++

      this.currentToast = newNotification
      this.showToast = true

      // Hide toast after 5 seconds
      setTimeout(() => {
        this.showToast = false
        this.currentToast = null
      }, 5000)

      return newNotification.id
    },

    notify(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', link?: string) {
      return this.addNotification({ title, message, type, link: '/notifications' })
    },

    success(title: string, message: string, link?: string) {
      return this.notify(title, message, 'success', '/notifications')
    },

    error(title: string, message: string, link?: string) {
      return this.notify(title, message, 'error', '/notifications')
    },

    warning(title: string, message: string, link?: string) {
      return this.notify(title, message, 'warning', '/notifications')
    },

    info(title: string, message: string, link?: string) {
      return this.notify(title, message, 'info', '/notifications')
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