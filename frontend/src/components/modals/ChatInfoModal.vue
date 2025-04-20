<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePrivacyStore } from '../../stores/privacyStore'
import type { ChatPartner } from '../../interfaces/interfaces'
import PrivacyConfirmationModal from './PrivacyConfirmationModal.vue'

const router = useRouter()
const privacyStore = usePrivacyStore()
const showNotification = ref(false)
const notificationMessage = ref('')

const props = defineProps<{
  isOpen: boolean
  chatPartner: ChatPartner | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isUserMuted = computed(() => {
  if (!props.chatPartner?.id) return false
  return privacyStore.isUserMuted(props.chatPartner.id)
})

const isUserBlocked = computed(() => {
  if (!props.chatPartner?.id) return false
  return privacyStore.isUserBlocked(props.chatPartner.id)
})

// Watch for changes in success message to show notification
watch(() => privacyStore.successMessage, (newVal) => {
  if (newVal) {
    notificationMessage.value = newVal
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
})


const showPrivacyModal = ref(false)
const privacyAction = ref<'mute' | 'unmute' | 'block' | 'unblock'>('mute')

function closeModal() {
  privacyStore.clearMessages()
  emit('close')
}

function handleAction(action: string) {
  if (action === 'viewProfile' && props.chatPartner?.id) {
    router.push(`/developer/${props.chatPartner.id}`)
    closeModal()
  } else if (action === 'report' && props.chatPartner?.id) {
    router.push({ name: 'report', params: { targetId: props.chatPartner.id.toString() }})
    closeModal()
  } else if (action === 'mute' && props.chatPartner?.id) {
    privacyAction.value = isUserMuted.value ? 'unmute' : 'mute'
    showPrivacyModal.value = true
  } else if (action === 'block' && props.chatPartner?.id) {
    privacyAction.value = isUserBlocked.value ? 'unblock' : 'block'
    showPrivacyModal.value = true
  } else {
    alert(`Action: ${action}`)
  }
}

function handlePrivacyConfirm() {
  if (!props.chatPartner?.id) return
  
  showPrivacyModal.value = false
  
  // Perform the action based on what was confirmed
  switch (privacyAction.value) {
    case 'mute':
      privacyStore.muteUser(props.chatPartner.id, props.chatPartner.name)
      break
    case 'unmute':
      privacyStore.unmuteUser(props.chatPartner.id, props.chatPartner.name)
      break
    case 'block':
      privacyStore.blockUser(props.chatPartner.id, props.chatPartner.name)
      break
    case 'unblock':
      privacyStore.unblockUser(props.chatPartner.id, props.chatPartner.name)
      break
  }
}

function handlePrivacyCancel() {
  showPrivacyModal.value = false
}

// Save privacy settings to localStorage when component unmounts
function beforeUnmount() {
  privacyStore.savePrivacySettings()
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
    <div class="flex items-center justify-center min-h-screen p-4">
      <!-- Modal panel -->
      <div
        class="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="p-6 space-y-6">
          <!-- Close button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Profile section -->
          <div class="flex flex-col items-center text-center space-y-4">
            <div class="relative">
              <img
                v-if="chatPartner?.avatar"
                :src="chatPartner.avatar"
                :alt="chatPartner.name"
                class="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
              >
              <div
                v-else
                class="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold ring-4 ring-primary/5"
              >
                {{ chatPartner?.name && chatPartner.name.charAt(0).toUpperCase() }}
              </div>
              <div
                class="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white"
                :class="chatPartner?.isOnline ? 'bg-green-400' : 'bg-gray-300'"
              ></div>
            </div>

            <div class="space-y-1">
              <h4 class="text-2xl font-bold text-gray-900">{{ chatPartner?.name }}</h4>
              <p class="text-sm font-medium" :class="chatPartner?.isOnline ? 'text-green-500' : 'text-gray-500'">
                {{ chatPartner?.isOnline ? 'Online' : 'Offline' }}
              </p>
            </div>

            <div class="w-full pt-2 flex justify-center">
              <button
                @click="handleAction('viewProfile')"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Full Profile
              </button>
            </div>
          </div>

          <!-- Privacy and Support Section -->
          <div class="border-t pt-6 space-y-2">
            <h5 class="font-medium text-gray-900 mb-4">Privacy and Support</h5>
            <button
              @click="handleAction('mute')"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors"
              :class="{ 'bg-gray-100': isUserMuted }"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>{{ isUserMuted ? 'Unmute Notifications' : 'Mute Notifications' }}</span>
            </button>
            <button
              @click="handleAction('block')"
              class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors"
              :class="{ 'bg-gray-100': isUserBlocked }"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>{{ isUserBlocked ? 'Unblock this user' : 'Block this user' }}</span>
            </button>
            <button
              @click="handleAction('report')"
              class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Report User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Privacy Confirmation Modal -->
    <PrivacyConfirmationModal
      v-if="chatPartner"
      :is-open="showPrivacyModal"
      :action="privacyAction"
      :user-name="chatPartner.name"
      @confirm="handlePrivacyConfirm"
      @cancel="handlePrivacyCancel"
    />
  </div>
</template>

<style scoped>
.transform {
  transition: transform 0.2s ease-in-out;
}
</style>
