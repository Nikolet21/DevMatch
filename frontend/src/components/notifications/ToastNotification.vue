<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faInfoCircle, faCheckCircle, faExclamationTriangle, faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons'

const notificationStore = useNotificationStore()

const visible = computed(() => notificationStore.showToast)
const toast = computed(() => notificationStore.currentToast)

const hideToast = () => {
  notificationStore.hideToast()
}

const getIcon = computed(() => {
  if (!toast.value) return faInfoCircle
  
  switch (toast.value.type) {
    case 'success':
      return faCheckCircle
    case 'warning':
      return faExclamationTriangle
    case 'error':
      return faTimesCircle
    default:
      return faInfoCircle
  }
})

const getToastClass = computed(() => {
  if (!toast.value) return 'bg-blue-100 border-blue-500'
  
  switch (toast.value.type) {
    case 'success':
      return 'bg-green-100 border-green-500'
    case 'warning':
      return 'bg-yellow-100 border-yellow-500'
    case 'error':
      return 'bg-red-100 border-red-500'
    default:
      return 'bg-blue-100 border-blue-500'
  }
})

const getIconClass = computed(() => {
  if (!toast.value) return 'text-blue-500'
  
  switch (toast.value.type) {
    case 'success':
      return 'text-green-500'
    case 'warning':
      return 'text-yellow-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-blue-500'
  }
})

const navigateToLink = () => {
  if (toast.value?.link) {
    window.location.href = toast.value.link
    hideToast()
  }
}
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible && toast"
      :class="['fixed right-4 top-4 max-w-sm border-l-4 rounded shadow-lg p-4 z-50 flex items-start', getToastClass]"
      role="alert"
    >
      <div :class="['mr-3', getIconClass]">
        <font-awesome-icon :icon="getIcon" class="text-lg" />
      </div>
      <div class="flex-1">
        <div class="font-bold">{{ toast.title }}</div>
        <div>{{ toast.message }}</div>
        <div v-if="toast.link" class="mt-2">
          <button
            @click="navigateToLink"
            class="text-sm underline text-blue-600 hover:text-blue-800"
          >
            View details
          </button>
        </div>
      </div>
      <button
        @click="hideToast"
        class="ml-auto -mt-1 -mr-1 text-gray-500 hover:text-gray-700"
        aria-label="Close notification"
      >
        <font-awesome-icon :icon="faTimes" />
      </button>
    </div>
  </Transition>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.toast-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style> 