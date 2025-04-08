<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useProfileStore } from '../../stores/profileStore'
import ImagePreviewModal from './ImagePreviewModal.vue'

const userStore = useUserStore()
const profileStore = useProfileStore()
const newSkill = ref('')
const imageCaption = ref('')
const photoUploadInput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<{ id: string; url: string; caption: string } | null>(null)

const emit = defineEmits(['close'])

onMounted(() => {
  profileStore.setIsEditing(true)
})

onUnmounted(() => {
  profileStore.setIsEditing(false)
})

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    if (profileStore.userAlbum.length >= 4) {
      alert('Maximum 4 images allowed in the album')
      return
    }
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        profileStore.addImage(e.target.result as string, imageCaption.value)
        imageCaption.value = ''
      }
    }

    reader.readAsDataURL(file)
  }
}

const triggerFileUpload = () => {
  photoUploadInput.value?.click()
}

const addSkill = () => {
  if (newSkill.value.trim() && !profileStore.editForm.skills.includes(newSkill.value.trim())) {
    profileStore.editForm.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (skill: string) => {
  profileStore.editForm.skills = profileStore.editForm.skills.filter(s => s !== skill)
}

const saveProfile = async () => {
  try {
    const updatedProfile = {
      firstName: profileStore.editForm.firstName,
      lastName: profileStore.editForm.lastName,
      email: profileStore.editForm.email,
      skills: profileStore.editForm.skills,
      bio: profileStore.editForm.bio,
      album: profileStore.editForm.album
    }

    await profileStore.updateProfile(updatedProfile)
    userStore.$patch({
      user: {
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email
      }
    })
    profileStore.setIsEditing(false)
    emit('close')
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            @click="profileStore.cancelEdit(); emit('close')"
            class="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="profileStore.editForm.firstName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="profileStore.editForm.lastName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="profileStore.editForm.email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              :disabled="true"
            />
          </div>

          <!-- Bio Field -->
          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              v-model="profileStore.editForm.bio"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>

        <!-- Skills -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="skill in profileStore.editForm.skills"
              :key="skill"
              class="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 flex items-center"
            >
              {{ skill }}
              <button
                type="button"
                @click="removeSkill(skill)"
                class="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              type="text"
              v-model="newSkill"
              placeholder="Add a skill"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              @keyup.enter.prevent="addSkill"
            />
            <button
              type="button"
              @click="addSkill"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Photo Album -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Photo Album</label>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="image in profileStore.editForm.album"
              :key="image.id"
              class="relative aspect-[4/3] rounded-lg overflow-hidden group"
            >
              <img
                :src="image.url"
                :alt="image.caption"
                class="w-full h-full object-cover cursor-pointer"
                @click="selectedImage = image"
              />
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  @click="profileStore.removeImage(image.id)"
                  class="text-white hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Add Photo Button -->
            <div
              v-if="profileStore.editForm.album.length < 4"
              class="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
              @click="triggerFileUpload"
            >
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    Upload a photo
                  </label>
                </div>
              </div>
              <input
                ref="photoUploadInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>

  <ImagePreviewModal v-if="selectedImage" :image="selectedImage" @close="selectedImage = null" />
</div>
</template>
