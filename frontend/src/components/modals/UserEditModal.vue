<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import type { User, AlbumImage } from '@/interfaces/interfaces'

const props = defineProps<{
  isOpen: boolean
  user: User | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', userData: Partial<User>): void
}>()

const editForm = ref<Partial<User>>({})
const newSkill = ref('')

// Reset form when user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    editForm.value = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      skills: newUser.skills || [],
      bio: newUser.bio || '',
      githubUrl: newUser.githubUrl || '',
      linkedinUrl: newUser.linkedinUrl || '',
      album: newUser.album || []
    }
  } else {
    editForm.value = {}
  }
}, { immediate: true })

// Reset form when modal opens/closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    editForm.value = {}
  } else if (props.user) {
    editForm.value = {
      id: props.user.id,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      role: props.user.role,
      status: props.user.status,
      skills: props.user.skills || [],
      bio: props.user.bio || '',
      githubUrl: props.user.githubUrl || '',
      linkedinUrl: props.user.linkedinUrl || '',
      album: props.user.album || []
    }
  }
})

const saveChanges = () => {
  // If the role was previously "user", change it to "developer"
  if (editForm.value.role === 'user') {
    editForm.value.role = 'developer'
  }
  emit('save', editForm.value)
}

const addSkill = () => {
  const skill = newSkill.value.trim()
  if (skill && !editForm.value.skills?.includes(skill)) {
    editForm.value.skills = [...(editForm.value.skills || []), skill]
    newSkill.value = ''
  }
}

const removeSkill = (skillToRemove: string) => {
  editForm.value.skills = editForm.value.skills?.filter(skill => skill !== skillToRemove) || []
}

// Helper function to get initials from name
const getInitials = () => {
  return ((props.user?.firstName?.[0] || '') + (props.user?.lastName?.[0] || '')).toUpperCase()
}
</script>

<template>
  <div v-if="isOpen && user" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop -->
      <div class="fixed inset-0 transition-opacity bg-gray-900/80 backdrop-blur-sm" aria-hidden="true" @click="emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
        <!-- Modal header with gradient background -->
        <div class="relative px-6 py-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Edit User Profile
          </h3>
          <p class="text-sm text-text-secondary mt-1">Update user information and settings</p>
          
          <!-- Close button -->
          <button
            @click="emit('close')"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal content -->
        <div class="px-6 py-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div class="space-y-6">
            <!-- User identity section -->
            <div class="flex items-center mb-2">
              <div class="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg border-2 border-white">
                <span class="text-white text-lg font-bold">{{ getInitials() }}</span>
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-text-primary">
                  {{ user.firstName }} {{ user.lastName }}
                </h4>
                <p class="text-sm text-text-secondary">{{ user.email }}</p>
              </div>
            </div>
            
            <div class="pt-4">
              <!-- Basic Information Section -->
              <div class="bg-gray-50 rounded-xl p-5 shadow-sm mb-6">
                <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h4>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      id="firstName"
                      v-model="editForm.firstName"
                      type="text"
                      class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      id="lastName"
                      v-model="editForm.lastName"
                      type="text"
                      class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
                
                <div class="mb-4">
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    v-model="editForm.email"
                    type="email"
                    class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      id="role"
                      v-model="editForm.role"
                      class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="developer">Developer</option>
                    </select>
                  </div>
                  <div>
                    <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      id="status"
                      v-model="editForm.status"
                      class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Bio Section -->
              <div class="bg-gray-50 rounded-xl p-5 shadow-sm mb-6">
                <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Biography
                </h4>
                
                <div>
                  <textarea
                    id="bio"
                    v-model="editForm.bio"
                    rows="4"
                    placeholder="Tell us about this developer..."
                    class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  ></textarea>
                </div>
              </div>
              
              <!-- Skills Section -->
              <div class="bg-gray-50 rounded-xl p-5 shadow-sm mb-6">
                <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Skills
                </h4>
                
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="skill in editForm.skills"
                    :key="skill"
                    class="bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs font-medium flex items-center"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      @click="removeSkill(skill)"
                      class="ml-2 text-secondary hover:text-secondary/80 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
                
                <div class="flex gap-2">
                  <input
                    type="text"
                    v-model="newSkill"
                    placeholder="Add a skill..."
                    class="block w-full rounded-lg border-0 py-2.5 px-4 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    @keyup.enter="addSkill"
                  />
                  <button
                    type="button"
                    @click="addSkill"
                    class="px-4 py-2.5 text-sm font-medium text-white bg-secondary border border-transparent rounded-lg shadow-sm hover:bg-secondary/90 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <!-- Social Links Section -->
              <div class="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Social Links
                </h4>
                
                <div class="space-y-4">
                  <div>
                    <label for="githubUrl" class="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <input
                        id="githubUrl"
                        v-model="editForm.githubUrl"
                        type="url"
                        placeholder="https://github.com/username"
                        class="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label for="linkedinUrl" class="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </div>
                      <input
                        id="linkedinUrl"
                        v-model="editForm.linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        class="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-text-primary bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 transition-all duration-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            @click="emit('close')"
            class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            @click="saveChanges"
            class="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
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