<script setup lang="ts">
const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()
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

    <div class="space-y-4">
      <div v-for="i in 5" :key="i"
        class="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg hover:border-primary/20 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div class="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400">
              </div>
            </div>
            <div>
              <h3 class="font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                Chat Partner Name</h3>
              <p class="text-sm text-text-secondary">Last message preview...</p>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-1">
            <span class="text-xs text-text-secondary">2h ago</span>
            <span class="px-2 py-0.5 text-xs font-medium text-white bg-primary rounded-full">2</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
