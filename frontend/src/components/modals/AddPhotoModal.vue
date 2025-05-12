<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div class="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 border border-white/30 transform hover:scale-[1.01] transition-all duration-300">
      <div class="text-center">
        <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Add Photo Caption</h3>
        
        <div class="mb-5 rounded-xl overflow-hidden shadow-md">
          <img v-if="imageUrl" :src="imageUrl" alt="Preview" class="w-full h-56 object-cover" />
        </div>
        
        <div class="mb-5">
          <label for="photo-caption" class="block text-sm font-medium text-gray-700 mb-1 text-left">Caption (optional)</label>
          <input
            id="photo-caption"
            type="text"
            v-model="caption"
            placeholder="Describe this photo..."
            class="w-full rounded-xl border-0 px-4 py-3 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200 hover:bg-gray-50"
          />
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button 
            @click="$emit('cancel')" 
            class="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Cancel
          </button>
          <button 
            @click="confirm" 
            class="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none text-sm"
          >
            Add Photo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ imageUrl: string, show: boolean }>()
const emit = defineEmits(['confirm', 'cancel'])
const caption = ref('')

watch(() => props.show, (val) => {
  if (!val) caption.value = ''
})

function confirm() {
  emit('confirm', caption.value)
}
</script> 