<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faInfoCircle, faCheckCircle, faExclamationTriangle, faTimesCircle, faTimes, faBell, faTrashAlt, faCheckDouble, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { mockNotifications } from '@/data/mockData'

const notificationStore = useNotificationStore()
const router = useRouter()

const notifications = computed(() => notificationStore.allNotifications)
const hasNotifications = computed(() => notifications.value.length > 0)
const hasUnread = computed(() => notificationStore.hasUnread)

const navigateToLink = (link: string | undefined) => {
  if (link) {
    router.push(link)
  }
}

const formatDate = (date: Date) => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return 'just now'
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return faCheckCircle
    case 'warning':
      return faExclamationTriangle
    case 'error':
      return faTimesCircle
    default:
      return faInfoCircle
  }
}

const getIconClass = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'warning':
      return 'text-yellow-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-primary'
  }
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const clearAllNotifications = () => {
  notificationStore.clearAllNotifications()
}

const generateDemoNotifications = () => {
  // Clear existing notifications first
  notificationStore.clearAllNotifications();
  
  // Add mock notifications from the mockData file
  mockNotifications.forEach(notification => {
    notificationStore.addNotification({
      ...notification,
      // Generate a new ID to ensure uniqueness
      id: undefined
    });
  });
  
  // Mark notifications that should be read as read
  notificationStore.notifications
    .filter(n => {
      const mockNotification = mockNotifications.find(mn => mn.title === n.title && mn.message === n.message);
      return mockNotification && mockNotification.read;
    })
    .forEach(n => notificationStore.markAsRead(n.id));
}

onMounted(() => {
  // No need to add demo notifications here anymore
  // They are now being created in HomeView.vue
})
</script>

<template>
  <div class="min-h-screen bg-background pt-20 pb-8">
    <div class="container mx-auto px-4 py-6 max-w-4xl">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div class="flex items-center">
            <button 
              @click="router.push('/home')" 
              class="mr-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg p-2 transition-all duration-200"
            >
              <font-awesome-icon icon="arrow-left" class="text-sm" />
            </button>
            <h1 class="text-2xl font-bold flex items-center">
              <font-awesome-icon :icon="faBell" class="mr-2 text-primary" />
              Notifications
            </h1>
          </div>
          <div v-if="hasNotifications" class="flex space-x-3">
            <button
              v-if="hasUnread"
              @click="markAllAsRead"
              class="px-3 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 flex items-center text-sm font-medium transition-all duration-200"
            >
              <font-awesome-icon :icon="faCheckDouble" class="mr-1" />
              Mark all as read
            </button>
            <button
              @click="clearAllNotifications"
              class="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center text-sm font-medium transition-all duration-200"
            >
              <font-awesome-icon :icon="faTrashAlt" class="mr-2" />
              Clear all
            </button>
          </div>
        </div>

        <div v-if="hasNotifications" class="bg-white">
          <ul class="divide-y divide-gray-100">
            <li
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'p-4 hover:bg-gray-50 transition-all duration-200 flex rounded-lg my-1',
                !notification.read ? 'bg-primary/5 border-l-4 border-primary' : ''
              ]"
              @click="notificationStore.markAsRead(notification.id)"
            >
              <div :class="['mr-4 mt-1', getIconClass(notification.type)]">
                <font-awesome-icon :icon="getIcon(notification.type)" class="text-xl" />
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <h3 class="font-semibold text-text-primary">{{ notification.title }}</h3>
                  <span class="text-sm text-gray-500 ml-2">{{ formatDate(notification.timestamp) }}</span>
                </div>
                <p class="text-text-secondary mt-1">{{ notification.message }}</p>
                <div v-if="notification.link" class="mt-2">
                  <button
                    @click.stop="navigateToLink(notification.link)"
                    class="text-sm text-primary hover:text-primary/80 hover:underline transition-colors duration-200 font-medium"
                  >
                    View details
                  </button>
                </div>
              </div>
              <button
                @click.stop="notificationStore.removeNotification(notification.id)"
                class="ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                aria-label="Remove notification"
              >
                <font-awesome-icon :icon="faTimes" />
              </button>
            </li>
          </ul>
        </div>

        <div
          v-else
          class="bg-gray-50 rounded-lg p-8 text-center text-gray-500 flex flex-col items-center my-8"
        >
          <font-awesome-icon :icon="faBell" class="text-5xl mb-4 text-gray-300" />
          <p class="text-lg">You have no notifications</p>
          <p class="text-sm text-gray-400 mt-2">When you receive notifications, they will appear here</p>
          
          <button 
            @click="generateDemoNotifications" 
            class="mt-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Generate Demo Notifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 