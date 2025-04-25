<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityLogger } from '@/composables/useActivityLogger'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  confirmPhrase: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const router = useRouter()
const { logActivity } = useActivityLogger()

const deleteConfirmation = ref('')
const showErrorMsg = ref(false)
const isDeleting = ref(false)
const confirmError = ref(false)

watch(() => props.show, (newVal) => {
  if (!newVal) {
    deleteConfirmation.value = ''
    showErrorMsg.value = false
    isDeleting.value = false
    confirmError.value = false
  }
})

const closeModal = () => {
  emit('close')
}

const confirmDelete = () => {
  if (deleteConfirmation.value === props.confirmPhrase) {
    isDeleting.value = true

    // Log the account deletion activity
    logActivity('Account Deleted', { timestamp: new Date() })

    // Simulate API call
    setTimeout(() => {
      isDeleting.value = false
      // Redirect to login after account deletion
      router.push('/login')
      emit('confirm')
    }, 1500)
  } else {
    showErrorMsg.value = true
    setTimeout(() => {
      showErrorMsg.value = false
    }, 3000)
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen p-4">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" @click="closeModal" aria-hidden="true"></div>

        <!-- Modal panel - centered using absolute positioning -->
        <div class="relative z-10 w-full max-w-md mx-auto overflow-hidden text-left bg-white rounded-2xl shadow-xl border border-gray-200">
          <!-- Modal header with warning icon -->
          <div class="relative bg-red-600 px-6 py-4 text-white">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-white rounded-full p-2 shadow-md">
                <font-awesome-icon icon="exclamation-triangle" class="h-6 w-6 text-red-600" />
              </div>
              <h3 class="ml-4 text-xl font-bold tracking-tight" id="modal-title">
                Delete Account
              </h3>
            </div>
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-white hover:text-red-100 focus:outline-none"
              aria-label="Close modal"
            >
              <font-awesome-icon icon="times" class="h-5 w-5" />
            </button>
          </div>

          <!-- Modal content -->
          <div class="px-6 py-5">
            <div class="space-y-4">
              <div class="p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <font-awesome-icon icon="info-circle" class="h-5 w-5 text-red-600" />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-800">
                      This action <span class="font-bold">cannot be undone</span>. All your data will be permanently removed from our servers.
                    </p>
                  </div>
                </div>
              </div>

              <p class="text-gray-700">
                To confirm, please type <span class="font-bold text-red-600">{{ confirmPhrase }}</span> in the box below:
              </p>

              <div class="relative">
                <input
                  v-model="deleteConfirmation"
                  type="text"
                  class="block w-full rounded-lg border-gray-300 shadow-sm py-3 px-4 text-base focus:border-red-500 focus:ring-red-500 transition-all duration-200"
                  :class="{ 'border-red-500 ring-1 ring-red-500': showErrorMsg }"
                  placeholder="Type DELETE to confirm"
                  autocomplete="off"
                />
                <div v-if="showErrorMsg" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <font-awesome-icon icon="exclamation-circle" class="h-5 w-5 text-red-500" />
                </div>
                <p v-if="showErrorMsg" class="mt-1 text-sm text-red-600">Please type the exact phrase to confirm deletion.</p>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-2">
            <button
              @click="closeModal"
              type="button"
              class="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-colors duration-200"
            >
              <font-awesome-icon icon="times" class="mr-2" />
              Cancel
            </button>
            <button
              @click="confirmDelete"
              type="button"
              :disabled="deleteConfirmation !== confirmPhrase"
              class="inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <font-awesome-icon icon="trash-alt" class="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
