<script setup lang="ts">
import { useChatStore } from '../stores/chatStore'
import { useUserStore } from '../stores/userStore'
import { ref, computed, nextTick } from 'vue'
import ChatInfoModal from './ChatInfoModal.vue'

const chatStore = useChatStore()
const userStore = useUserStore()
const messageInput = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const showInfoModal = ref(false)

const selectedChat = computed(() => chatStore.selectedChat)
const chatPartner = computed(() => selectedChat.value ? chatStore.getChatPartner(selectedChat.value.id) ?? null : null)
const currentUser = computed(() => userStore.currentUser)

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (hours > 24) {
    return date.toLocaleDateString()
  } else if (hours > 0) {
    return `${hours}h ago`
  } else {
    return `${minutes}m ago`
  }
}

async function sendMessage() {
  if (!messageInput.value.trim() || !selectedChat.value || !chatPartner.value) return

  chatStore.sendMessage(
    selectedChat.value.id,
    messageInput.value,
    'currentUser',
    chatPartner.value.id
  )

  messageInput.value = ''

  // Scroll to bottom after message is sent
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}
</script>

<template>
  <div v-if="selectedChat" class="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Chat Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <img v-if="chatPartner?.avatar" :src="chatPartner.avatar" :alt="chatPartner.name"
              class="h-10 w-10 rounded-full object-cover">
            <div v-else
              class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {{ chatPartner?.name && chatPartner.name.charAt(0).toUpperCase() }}
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
              :class="chatPartner?.isOnline ? 'bg-green-400' : 'bg-gray-300'">
            </div>
          </div>
          <div>
            <h2 class="font-semibold text-text-primary">{{ chatPartner?.name || 'Unknown User' }}</h2>
            <p class="text-sm text-text-secondary">{{ chatPartner?.isOnline ? 'Online' : 'Offline' }}</p>
          </div>
        </div>
        <button
          @click="showInfoModal = true"
          class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          title="Show chat information"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 p-6 space-y-4 overflow-y-auto" ref="messageContainer">
      <template v-if="selectedChat.messages.length > 0">
        <div v-for="message in selectedChat.messages" :key="message.id"
          class="flex items-start space-x-4" :class="{ 'flex-row-reverse space-x-reverse': message.senderId === 'currentUser' }">
          <div class="flex-shrink-0">
            <img :src="message.senderId === 'currentUser' ? currentUser?.avatar : chatPartner?.avatar"
              :alt="message.senderId === 'currentUser' ? currentUser?.firstName : chatPartner?.name"
              class="h-8 w-8 rounded-full object-cover">
          </div>
          <div class="flex-1 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900">
                {{ message.senderId === 'currentUser' ? currentUser?.firstName : chatPartner?.name }}
              </span>
              <span class="text-xs text-gray-500">{{ formatTimestamp(new Date(message.timestamp)) }}</span>
            </div>
            <p class="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 break-words" :class="{
              'bg-primary/10': message.senderId === 'currentUser',
              'bg-gray-50': message.senderId !== 'currentUser'
            }">
              {{ message.content }}
            </p>
          </div>
        </div>
      </template>
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex-shrink-0 px-6 py-4 border-t border-gray-100">
      <form @submit.prevent="sendMessage" class="flex items-center space-x-4">
        <input v-model="messageInput" type="text" placeholder="Type your message..."
          class="flex-1 min-w-0 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
        <button type="submit"
          class="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
          Send
        </button>
      </form>
    </div>
  </div>

  <!-- No Chat Selected State -->
  <div v-else class="h-full flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="text-center">
      <div class="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
          </path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-text-primary">Select a chat</h3>
      <p class="text-text-secondary mt-2">Choose a conversation to start messaging</p>
    </div>
  </div>

  <ChatInfoModal
    :is-open="showInfoModal"
    :chat-partner="chatPartner"
    @close="showInfoModal = false"
  />
</template>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.primary/30') theme('colors.gray.100');
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: theme('colors.primary/30');
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.primary/50');
}
</style>
