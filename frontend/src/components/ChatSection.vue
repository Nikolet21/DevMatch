<script setup lang="ts">
import { useChatStore } from '../stores/chatStore'
import { computed } from 'vue'

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()

const chatStore = useChatStore()
const sortedChats = computed(() => chatStore.sortedChats)

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

function selectChat(chatId: string) {
  chatStore.selectChat(chatId)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary">Active Chats</h1>
      <div class="relative">
        <input type="text" placeholder="Search conversations..."
          class="w-64 rounded-lg border-gray-200 bg-white/50 px-4 py-2 text-sm focus:border-primary focus:ring-primary" />
      </div>
    </div>

    <div v-if="sortedChats.length === 0" class="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-primary/5">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </div>
        <h3 class="text-xl font-semibold text-text-primary">No active chats</h3>
        <p class="text-text-secondary max-w-md">Start matching with other developers to begin chatting!</p>
        <button @click="emit('update:activeTab', 'matches')" class="mt-6 rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
          Find Matches
        </button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div v-for="chat in sortedChats" :key="chat.id"
        @click="selectChat(chat.id)"
        class="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <img v-if="chatStore.getChatPartner(chat.id)?.avatar"
                :src="chatStore.getChatPartner(chat.id)?.avatar"
                :alt="chatStore.getChatPartner(chat.id)?.name"
                class="h-10 w-10 rounded-full object-cover">
              <div v-else class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {{ chatStore.getChatPartner(chat.id)?.name?.charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
                :class="chatStore.getChatPartner(chat.id)?.isOnline ? 'bg-green-400' : 'bg-gray-300'">
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                {{ chatStore.getChatPartner(chat.id)?.name }}</h3>
              <p class="text-sm text-text-secondary">{{ chat.lastMessage?.content }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-1">
            <span class="text-xs text-text-secondary">{{ chat.lastMessage ? formatTimestamp(chat.lastMessage.timestamp) : '' }}</span>
            <span v-if="chatStore.getUnreadCount(chat.id)"
              class="px-2 py-0.5 text-xs font-medium text-white bg-primary rounded-full">
              {{ chatStore.getUnreadCount(chat.id) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
