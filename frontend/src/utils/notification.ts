import { useNotificationStore } from '@/stores/notificationStore'

export const notify = {

  info: (title: string, message: string, link?: string) => {
    const store = useNotificationStore()
    return store.info(title, message, link)
  },

  success: (title: string, message: string, link?: string) => {
    const store = useNotificationStore()
    return store.success(title, message, link)
  },

  warning: (title: string, message: string, link?: string) => {
    const store = useNotificationStore()
    return store.warning(title, message, link)
  },

  error: (title: string, message: string, link?: string) => {
    const store = useNotificationStore()
    return store.error(title, message, link)
  }
} 