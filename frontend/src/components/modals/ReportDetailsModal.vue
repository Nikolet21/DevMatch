<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import type { Report } from '@/interfaces/interfaces'
import { useUserStore } from '@/stores/userStore'

const props = defineProps<{
  isOpen: boolean
  report: Report | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'approve', reportId: number, action: string, resolution: string): void
  (e: 'deny', reportId: number, resolution: string): void
}>()

const userStore = useUserStore()
const resolution = ref('')
const showUserDetails = ref(false)
const selectedAction = ref<string>('')

const reportedUser = computed(() => {
  if (!props.report?.targetId) return null
  return userStore.adminUsers.find(user => user.id === props.report?.targetId)
})

const isContentReport = computed(() => {
  return props.report?.type === 'content'
})

const userActions = [
  { id: 'warning', label: 'Issue Warning', description: 'Send a formal warning to the user', icon: 'warning', color: 'yellow' },
  { id: 'temporary-ban', label: 'Temporary Ban', description: 'Ban the user for 7 days', icon: 'clock', color: 'orange' },
  { id: 'permanent-ban', label: 'Permanent Ban', description: 'Permanently ban the user', icon: 'ban', color: 'red' }
]

const contentActions = [
  { id: 'remove-content', label: 'Remove Content', description: 'Remove the reported content', icon: 'trash', color: 'red' },
  { id: 'flag-content', label: 'Flag as Inappropriate', description: 'Flag the content but leave it visible', icon: 'flag', color: 'orange' },
  { id: 'warning-content', label: 'Warning + Keep Content', description: 'Warn user but keep content', icon: 'warning', color: 'yellow' }
]

const actions = computed(() => {
  return isContentReport.value ? contentActions : userActions
})

const handleApproveReport = () => {
  if (props.report && selectedAction.value) {
    emit('approve', props.report.id, selectedAction.value, resolution.value)
  }
}

const handleDenyReport = () => {
  if (props.report) {
    emit('deny', props.report.id, resolution.value)
  }
}

const toggleUserDetails = () => {
  showUserDetails.value = !showUserDetails.value
}

// Reset form when modal opens/closes
const resetForm = () => {
  resolution.value = ''
  selectedAction.value = ''
  showUserDetails.value = false
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-orange-100 text-orange-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Watch for modal opening and reset form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>

<template>
  <div v-if="isOpen && report" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-gray-900/80 backdrop-blur-sm" aria-hidden="true" @click="emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-2xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
        <!-- Modal header with gradient background -->
        <div class="relative px-6 py-6 bg-gradient-to-r from-primary/20 to-secondary/20">
          <!-- Close button moved to top-right corner with increased z-index -->
          <button
            @click="emit('close')"
            class="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/30 backdrop-blur-sm shadow-sm text-gray-700 hover:text-gray-900 hover:bg-white/50 focus:outline-none transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="flex flex-col space-y-3 pr-8"> <!-- Added right padding to make space for the close button -->
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm shadow-md mr-3">
                <svg v-if="isContentReport" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {{ isContentReport ? 'Content Report' : 'User Report' }}
              </h3>
            </div>
            
            <!-- Status badges moved to separate row -->
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 text-xs font-medium rounded-full shadow-sm" :class="getStatusClass(report.status)">
                {{ report.status.charAt(0).toUpperCase() + report.status.slice(1) }}
              </span>
              
              <span class="px-3 py-1 text-xs font-medium rounded-full shadow-sm" :class="getPriorityClass(report.priority)">
                Priority: {{ report.priority.charAt(0).toUpperCase() + report.priority.slice(1) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <p class="text-sm text-text-secondary">
                Submitted: {{ new Date(report.dateSubmitted).toLocaleDateString() }}
              </p>
              
              <div v-if="report.status === 'resolved'" class="flex items-center">
                <p class="text-sm text-text-secondary mr-2">
                  Resolved: {{ new Date(report.resolvedDate || '').toLocaleDateString() }}
                </p>
                <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Closed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal content -->
        <div class="px-6 py-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div class="space-y-6">
            <!-- Reported item section -->
            <div class="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ isContentReport ? 'Reported Content' : 'Reported User' }}
              </h4>
              
              <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div class="flex justify-between items-start">
                  <div>
                    <!-- Content detail or user detail -->
                    <div v-if="isContentReport" class="flex flex-col">
                      <span class="text-sm font-medium text-gray-700">{{ report.contentTitle }}</span>
                      <div class="flex items-center text-sm mt-1">
                        <span class="text-gray-500">By:</span>
                        <span class="ml-1 text-primary font-medium">{{ report.targetName }}</span>
                      </div>
                    </div>
                    <div v-else class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shadow-sm">
                        <span class="text-primary text-sm font-medium">
                          {{ (reportedUser?.firstName?.[0] || '') + (reportedUser?.lastName?.[0] || '') }}
                        </span>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ report.targetName }}</div>
                        <div class="text-xs text-gray-500">{{ reportedUser?.email }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <!-- View User Profile button if this is a user report -->
                    <button 
                      v-if="!isContentReport && reportedUser"
                      @click="toggleUserDetails" 
                      class="text-xs text-primary hover:text-primary/80 hover:underline flex items-center"
                    >
                      <span>{{ showUserDetails ? 'Hide details' : 'View profile details' }}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="showUserDetails" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reported user details -->
            <div v-if="showUserDetails && reportedUser" class="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Profile
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Role</p>
                  <span class="px-3 py-1 text-xs rounded-full capitalize mt-1 inline-block" 
                    :class="{
                      'bg-primary/10 text-primary': reportedUser.role === 'admin',
                      'bg-secondary/10 text-secondary': reportedUser.role === 'developer' || reportedUser.role === 'user'
                    }">
                    {{ reportedUser.role === 'user' ? 'Developer' : reportedUser.role }}
                  </span>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-500">Status</p>
                  <span class="px-3 py-1 text-xs rounded-full mt-1 inline-block"
                    :class="{
                      'bg-green-100 text-green-800': reportedUser.status === 'Active',
                      'bg-red-100 text-red-800': reportedUser.status === 'Inactive'
                    }">
                    {{ reportedUser.status }}
                  </span>
                </div>
              </div>
              
              <div v-if="reportedUser.bio" class="mt-4">
                <p class="text-sm font-medium text-gray-500">Bio</p>
                <p class="text-sm text-gray-700 mt-1 bg-white p-3 rounded-lg border border-gray-100">{{ reportedUser.bio }}</p>
              </div>
              
              <div v-if="reportedUser.skills && reportedUser.skills.length > 0" class="mt-4">
                <p class="text-sm font-medium text-gray-500">Skills</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span 
                    v-for="(skill, index) in reportedUser.skills" 
                    :key="index"
                    class="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Report details -->
            <div class="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Report Information
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div class="bg-white rounded-lg p-3 border border-gray-100 shadow-sm h-full">
                    <div class="flex items-center mb-2">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div class="ml-2">
                        <p class="text-sm font-medium text-gray-700">Reporter</p>
                        <p class="text-sm text-gray-600">{{ report.reporterName }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div class="bg-white rounded-lg p-3 border border-gray-100 shadow-sm h-full">
                    <div class="flex items-center mb-2">
                      <div class="h-8 w-8 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div class="ml-2">
                        <p class="text-sm font-medium text-gray-700">Reason</p>
                        <p class="text-sm text-gray-600">{{ report.reason }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Description</p>
                <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{{ report.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Resolution section -->
            <div v-if="report.resolution" class="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Resolution
              </h4>
              <div class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{{ report.resolution }}</p>
              </div>
            </div>
            
            <!-- Action selection (if report is pending) -->
            <div v-if="report.status === 'pending'" class="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Take Action
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div 
                  v-for="action in actions" 
                  :key="action.id" 
                  class="relative rounded-lg border border-gray-200 shadow-sm bg-white cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow"
                  :class="{ 'ring-2 ring-primary border-primary': selectedAction === action.id }"
                  @click="selectedAction = action.id"
                >
                  <div class="p-4">
                    <div class="absolute top-3 right-3">
                      <div v-if="selectedAction === action.id" class="h-5 w-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <div :class="`h-10 w-10 rounded-full bg-${action.color}-100 flex items-center justify-center shadow-sm`">
                        <svg v-if="action.icon === 'warning'" xmlns="http://www.w3.org/2000/svg" :class="`h-6 w-6 text-${action.color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <svg v-else-if="action.icon === 'clock'" xmlns="http://www.w3.org/2000/svg" :class="`h-6 w-6 text-${action.color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <svg v-else-if="action.icon === 'ban'" xmlns="http://www.w3.org/2000/svg" :class="`h-6 w-6 text-${action.color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <svg v-else-if="action.icon === 'trash'" xmlns="http://www.w3.org/2000/svg" :class="`h-6 w-6 text-${action.color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <svg v-else-if="action.icon === 'flag'" xmlns="http://www.w3.org/2000/svg" :class="`h-6 w-6 text-${action.color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 class="text-sm font-semibold text-gray-800">{{ action.label }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ action.description }}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label for="resolution" class="block text-sm font-medium text-gray-700 mb-2">Resolution Note</label>
                <textarea
                  id="resolution"
                  v-model="resolution"
                  rows="3"
                  placeholder="Add notes about how this report was resolved..."
                  class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            @click="emit('close')"
            class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            Close
          </button>
          
          <template v-if="report.status === 'pending'">
            <button
              @click="handleDenyReport"
              class="px-4 py-2.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-full shadow-sm transition-all duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Dismiss Report
            </button>
            
            <button
              @click="handleApproveReport"
              :disabled="!selectedAction"
              class="px-4 py-2.5 text-sm font-medium text-white rounded-full shadow-sm transition-all duration-200 flex items-center"
              :class="selectedAction ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Take Action
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(92, 106, 196, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(92, 106, 196, 0.5);
  border-radius: 20px;
}
</style> 