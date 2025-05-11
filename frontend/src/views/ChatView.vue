<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '../stores/chatStore'

const ChatSection = defineAsyncComponent(() => import('../components/ChatSection.vue'))
const ChatRoom = defineAsyncComponent(() => import('../components/ChatRoom.vue'))

const route = useRoute()
const chatStore = useChatStore()

onMounted(async () => {
  const developerId = route.params.id as string
  if (developerId) {
    await chatStore.initializeChat(developerId)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChatSection />
        <ChatRoom />
      </div>
    </div>
  </div>
</template>
