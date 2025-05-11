<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useProfileStore } from '../../stores/profileStore'
import { useActivityLogger } from '@/composables/useActivityLogger'
import ImagePreviewModal from './ImagePreviewModal.vue'
import { validateProfileForm, type ProfileFormErrors } from '../../utils/validation'

const userStore = useUserStore()
const profileStore = useProfileStore()
const { logProfileUpdated, logProfilePictureUpdated, logActivity } = useActivityLogger()
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
        // Log image upload
        logProfilePictureUpdated()
        imageCaption.value = ''
      }
    }

    reader.readAsDataURL(file)
  }
}

const triggerFileUpload = () => {
  photoUploadInput.value?.click()
}

const skillError = ref('')

const addSkill = () => {
  skillError.value = ''
  const trimmedSkill = newSkill.value.trim()

  if (!trimmedSkill) {
    skillError.value = 'Skill cannot be empty'
    return
  }

  if (!profileStore.editForm.skills.includes(trimmedSkill)) {
    profileStore.editForm.skills.push(trimmedSkill)
    newSkill.value = ''
  }
}

const removeSkill = (skill: string) => {
  profileStore.editForm.skills = profileStore.editForm.skills.filter(s => s !== skill)
}

const formErrors = ref<ProfileFormErrors>({})

const saveProfile = async () => {
  // Reset previous errors
  formErrors.value = {}

  // Validate form
  const errors = validateProfileForm(profileStore.editForm)
  if (Object.keys(errors).length > 0) {
    formErrors.value = errors
    return
  }

  try {
    const updatedProfile = {
      firstName: profileStore.editForm.firstName,
      lastName: profileStore.editForm.lastName,
      email: profileStore.editForm.email,
      skills: profileStore.editForm.skills,
      bio: profileStore.editForm.bio,
      album: profileStore.editForm.album,
      githubUrl: profileStore.editForm.githubUrl,
      linkedinUrl: profileStore.editForm.linkedinUrl
    }

    await profileStore.updateProfile(updatedProfile)

    // Log profile update with changed fields
    const updatedFields = [];
    if (profileStore.profile?.firstName !== updatedProfile.firstName) updatedFields.push('firstName');
    if (profileStore.profile?.lastName !== updatedProfile.lastName) updatedFields.push('lastName');
    if (profileStore.profile?.bio !== updatedProfile.bio) updatedFields.push('bio');
    if (profileStore.profile?.githubUrl !== updatedProfile.githubUrl) updatedFields.push('githubUrl');
    if (profileStore.profile?.linkedinUrl !== updatedProfile.linkedinUrl) updatedFields.push('linkedinUrl');
    if (profileStore.profile?.skills.join() !== updatedProfile.skills.join()) updatedFields.push('skills');

    console.log('Updated fields:', updatedFields);

    if (updatedFields.length > 0) {
      // Direct activity logging to ensure it works
      logActivity('Profile Updated', {
        fields: updatedFields,
        message: `Updated profile fields: ${updatedFields.join(', ')}`
      });
    }

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
    formErrors.value.general = 'Failed to update profile. Please try again.'
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/30 transform hover:scale-[1.01] transition-all duration-300">
      <div class="p-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Edit Profile</h2>
          <button
            @click="profileStore.cancelEdit(); emit('close')"
            class="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-full hover:bg-indigo-50"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-8">
          <!-- Name Fields -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 bg-white/60 p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="firstName"
                v-model="profileStore.editForm.firstName"
                class="mt-2 block w-full rounded-xl border-0 px-4 py-3.5 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200 hover:bg-gray-50"
              />
              <p v-if="formErrors.firstName" class="mt-1 text-sm text-red-600">{{ formErrors.firstName }}</p>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="lastName"
                v-model="profileStore.editForm.lastName"
                class="mt-2 block w-full rounded-xl border-0 px-4 py-3.5 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200 hover:bg-gray-50"
              />
              <p v-if="formErrors.lastName" class="mt-1 text-sm text-red-600">{{ formErrors.lastName }}</p>
            </div>
          </div>

          <!-- Email Field -->
          <div class="bg-white/60 p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model="profileStore.editForm.email"
              class="mt-2 block w-full rounded-xl border-0 px-4 py-3.5 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200 cursor-not-allowed opacity-80"
              :disabled="true"
            />
            <p class="mt-1 text-sm text-gray-500">Email address cannot be edited</p>
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">{{ formErrors.email }}</p>
          </div>

          <!-- Bio Field -->
          <div class="bg-white/60 p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300">
            <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id="bio"
              v-model="profileStore.editForm.bio"
              rows="4"
              class="mt-2 block w-full rounded-xl border-0 px-4 py-3.5 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200 hover:bg-gray-50"
              placeholder="Tell us about yourself..."
            ></textarea>
            <p v-if="formErrors.bio" class="mt-1 text-sm text-red-600">{{ formErrors.bio }}</p>
          </div>

          <!-- Social Links -->
          <div class="space-y-4 bg-white/60 p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300">
            <h3 class="text-lg font-semibold text-indigo-900 mb-4">Social Profiles</h3>
            <div>
              <label for="githubUrl" class="block text-sm font-medium text-gray-700">GitHub Profile URL</label>
              <div class="mt-2 flex rounded-xl overflow-hidden shadow-sm ring-1 ring-inset ring-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-all duration-200">
                <span class="flex items-center pl-4 pr-2 bg-indigo-50 text-indigo-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </span>
                <input
                  type="url"
                  id="githubUrl"
                  v-model="profileStore.editForm.githubUrl"
                  placeholder="https://github.com/username"
                  class="block flex-1 border-0 py-3.5 pl-2 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-transparent"
                />
              </div>
              <p v-if="formErrors.githubUrl" class="mt-1 text-sm text-red-600">{{ formErrors.githubUrl }}</p>
            </div>
            
            <div>
              <label for="linkedinUrl" class="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
              <div class="mt-2 flex rounded-xl overflow-hidden shadow-sm ring-1 ring-inset ring-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-all duration-200">
                <span class="flex items-center pl-4 pr-2 bg-indigo-50 text-indigo-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </span>
                <input
                  type="url"
                  id="linkedinUrl"
                  v-model="profileStore.editForm.linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  class="block flex-1 border-0 py-3.5 pl-2 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-transparent"
                />
              </div>
              <p v-if="formErrors.linkedinUrl" class="mt-1 text-sm text-red-600">{{ formErrors.linkedinUrl }}</p>
            </div>
          </div>

          <!-- Skills -->
          <div class="bg-white/60 p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300">
            <h3 class="text-lg font-semibold text-indigo-900 mb-4">Skills</h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="skill in profileStore.editForm.skills"
                :key="skill"
                class="px-3 py-1.5 rounded-full text-sm bg-indigo-100 text-indigo-800 flex items-center shadow-sm transform hover:scale-105 transition-all duration-200"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(skill)"
                  class="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  ×
                </button>
              </span>
              <span v-if="profileStore.editForm.skills.length === 0" class="text-sm text-gray-500 italic">
                No skills added yet
              </span>
            </div>
            <div class="flex gap-3">
              <div class="flex-1">
                <input
                  type="text"
                  v-model="newSkill"
                  placeholder="Add a skill (e.g. JavaScript, React, UI Design)"
                  class="w-full rounded-xl border-0 px-4 py-3.5 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200 hover:bg-gray-50"
                  @keyup.enter.prevent="addSkill"
                />
                <p v-if="skillError" class="mt-1 text-sm text-red-600">{{ skillError }}</p>
              </div>
              <button
                type="button"
                @click="addSkill"
                class="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Photo Album -->
          <div class="bg-white/60 p-6 rounded-2xl shadow-sm border border-indigo-50 hover:shadow-md transition-all duration-300">
            <h3 class="text-lg font-semibold text-indigo-900 mb-4">Portfolio Images</h3>
            <p class="text-sm text-gray-500 mb-4">Add up to 4 images showcasing your work</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="image in profileStore.editForm.album"
                :key="image.id"
                class="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <img
                  :src="image.url"
                  :alt="image.caption"
                  class="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  @click="selectedImage = image"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p class="text-white truncate font-medium">{{ image.caption || 'No caption' }}</p>
                  <div class="flex justify-end mt-2">
                    <button
                      type="button"
                      @click.stop="profileStore.removeImage(image.id)"
                      class="p-2 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Delete image"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add Photo Button -->
              <div
                v-if="profileStore.editForm.album.length < 4"
                class="aspect-[4/3] rounded-xl border-2 border-dashed border-indigo-300 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors bg-indigo-50/50 hover:bg-indigo-50 group"
                @click="triggerFileUpload"
              >
                <div class="text-center p-4">
                  <div class="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                    <svg class="h-8 w-8 text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div class="mt-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
                    Upload a photo
                  </div>
                  <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
            
            <div class="mt-4 flex items-center">
              <input
                type="text"
                v-model="imageCaption"
                placeholder="Add a caption for your next upload"
                class="w-full rounded-lg border-0 px-4 py-2 bg-gray-50/70 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200 hover:bg-gray-50"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="emit('close')"
              class="px-5 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
