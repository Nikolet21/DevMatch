<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useProfileStore } from '../stores/profileStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const EditProfileModal = defineAsyncComponent(() => import('../components/modals/EditProfileModal.vue'))
const AvatarPreviewModal = defineAsyncComponent(() => import('../components/modals/AvatarPreviewModal.vue'))
const DeleteConfirmationModal = defineAsyncComponent(() => import('../components/modals/DeleteConfirmationModal.vue'))
const ImagePreviewModal = defineAsyncComponent(() => import('../components/modals/ImagePreviewModal.vue'))

const userStore = useUserStore()
const profileStore = useProfileStore()
const imageCaption = ref('')
const photoUploadInput = ref<HTMLInputElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const showEditModal = ref(false)
const selectedImage = ref<{ id: string; url: string; caption: string } | null>(null)
const imageToDelete = ref<string | null>(null)

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

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        selectedImage.value = {
          id: 'avatar',
          url: e.target.result as string,
          caption: 'Profile Photo'
        }
      }
    }

    reader.readAsDataURL(file)
  }
}

const triggerFileUpload = () => {
  photoUploadInput.value?.click()
}

const confirmAvatarUpdate = async () => {
  if (selectedImage.value && selectedImage.value.id === 'avatar') {
    await userStore.updateAvatar(selectedImage.value.url)
    selectedImage.value = null
  }
}

const goToHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-500 to-purple-100 py-16">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
      <!-- Return Button -->
      <button
        @click="goToHome"
        class="mb-8 inline-flex items-center px-4 py-2 bg-white/90 text-indigo-600 rounded-lg hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Return to Home
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <!-- Left Column: Profile Information -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Profile Info Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <div class="flex flex-col space-y-6">
              <div class="flex items-start space-x-8">
                <div class="relative group flex-shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarUpload"
                    ref="avatarInput"
                  />
                  <div class="h-40 w-40 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                    <div
                      class="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white cursor-pointer"
                      @click="() => avatarInput?.click()"
                    >
                      <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" :alt="profileStore.fullName" class="h-full w-full object-cover" />
                      <svg v-else class="h-20 w-20 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div class="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer" @click="avatarInput?.click()">
                    <span class="text-white text-sm font-semibold">Change Photo</span>
                  </div>
                </div>
                <div class="flex-1 space-y-4">
                  <h1 class="text-4xl font-bold text-gray-900 tracking-tight">{{ profileStore.fullName }}</h1>
                  <p class="text-lg text-indigo-600 font-medium">{{ userStore.currentUser?.email }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="skill in profileStore.userSkills" :key="skill"
                      class="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-all duration-200 shadow-sm">
                      {{ skill }}
                    </span>
                  </div>
                  <button
                    @click="showEditModal = true"
                    class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- About Me Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">About Me</h3>
            <p class="text-gray-600 leading-relaxed">{{ profileStore.userBio || 'No bio added yet.' }}</p>
          </div>

          <!-- Skills Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Skills</h3>
            <div class="flex flex-wrap gap-3">
              <span v-for="skill in profileStore.userSkills" :key="skill"
                class="px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-all duration-200 shadow-sm">
                {{ skill }}
              </span>
              <span v-if="!profileStore.userSkills.length" class="text-gray-500 italic">No skills added yet.</span>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="space-y-2">
                <dt class="text-sm font-semibold text-gray-500">Email</dt>
                <dd class="text-lg text-gray-900">{{ userStore.currentUser?.email }}</dd>
              </div>
              <div class="space-y-2">
                <dt class="text-sm font-semibold text-gray-500">Full Name</dt>
                <dd class="text-lg text-gray-900">{{ profileStore.fullName }}</dd>
              </div>
            </dl>
          </div>

          <!-- Social Links Section -->
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Social Links</h3>
            <div class="flex flex-col space-y-4">
              <template v-if="profileStore.profile?.githubUrl || profileStore.profile?.linkedinUrl">
                <a
                  v-if="profileStore.profile?.githubUrl"
                  :href="profileStore.profile.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span class="text-gray-700 font-medium">GitHub Profile</span>
                </a>
                <a
                  v-if="profileStore.profile?.linkedinUrl"
                  :href="profileStore.profile.linkedinUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span class="text-gray-700 font-medium">LinkedIn Profile</span>
                </a>
              </template>
              <div v-else class="text-center py-6">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p class="text-gray-500 text-lg mb-2">No social links added yet</p>
                <button
                  @click="showEditModal = true"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-all duration-200"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Social Links
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Photo Album -->
        <div class="lg:col-span-5 h-full">
          <div class="bg-white shadow-xl rounded-3xl p-8 backdrop-blur-sm bg-opacity-95 transform hover:scale-[1.01] transition-all duration-300">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-gray-900">Photo Album</h3>
              <button
                v-if="!profileStore.isEditing"
                @click="showEditModal = true"
                class="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200"
              >
                Add Photos
              </button>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div
                v-for="image in profileStore.userAlbum"
                :key="image.id"
                class="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                @click="selectedImage = image; showEditModal = false"
              >
                <img
                  :src="image.url"
                  :alt="image.caption || 'Album photo'"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="text-sm font-medium truncate">{{ image.caption }}</p>
                        <p class="text-xs opacity-75">{{ new Date(image.uploadedAt).toLocaleDateString() }}</p>
                      </div>
                      <div class="flex gap-2">
                        <button @click.stop="showEditModal = true; selectedImage = null"
                          class="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                        >
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click.stop="imageToDelete = image.id" class="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Add Photo Placeholder -->
              <div
                v-if="profileStore.isEditing && profileStore.userAlbum.length < 4"
                class="aspect-square rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 transition-colors duration-200 flex items-center justify-center cursor-pointer group"
                @click="triggerFileUpload"
              >
                <div class="text-center p-4">
                  <svg class="w-12 h-12 mx-auto text-indigo-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <p class="mt-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">Add Photo</p>
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

            <!-- Empty State -->
            <div v-if="!profileStore.userAlbum.length" class="text-center py-12">
              <div class="mx-auto w-24 h-24 mb-6 text-indigo-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 class="text-xl font-semibold text-gray-900 mb-2">No photos yet</h4>
              <p class="text-gray-500 mb-6">Add up to 4 photos to showcase your work and personality</p>
              <button
                @click="showEditModal = true"
                class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal v-if="showEditModal" @close="showEditModal = false" />
      <AvatarPreviewModal
        v-if="selectedImage?.id === 'avatar'"
        :image-url="selectedImage.url"
        @close="selectedImage = null"
        @confirm="confirmAvatarUpdate"
      />
      <DeleteConfirmationModal
        v-if="imageToDelete"
        :image-id="imageToDelete"
        @confirm="profileStore.removeImage($event)"
        @close="imageToDelete = null"
      />
      <ImagePreviewModal
        v-if="selectedImage && selectedImage.id !== 'avatar'"
        :image="selectedImage"
        @close="selectedImage = null"
      />
    </div>
  </div>
</template>
