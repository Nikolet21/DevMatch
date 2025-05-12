<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useProfileStore } from '../stores/profileStore'
import { useActivityLogger } from '@/composables/useActivityLogger'
import { useRouter } from 'vue-router'
import AddPhotoModal from '../components/modals/AddPhotoModal.vue'

// Predefined developer skills
const developerSkills = [
  // Frontend
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Svelte',
  'Next.js', 'Nuxt.js', 'Tailwind CSS', 'Bootstrap', 'Sass/SCSS', 'Webpack', 'Vite',
  'Redux', 'Vuex', 'GraphQL', 'Apollo Client',
  
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'Ruby on Rails', 'Spring Boot',
  'ASP.NET', 'Laravel', 'PHP', 'Python', 'Java', 'C#', 'Go', 'Rust',
  
  // Database
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase',
  'SQLite', 'Oracle', 'Microsoft SQL Server',
  
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Android Development',
  'iOS Development', 'Xamarin',
  
  // DevOps & Tools
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD',
  'Git', 'Jenkins', 'Terraform', 'Ansible',
  
  // Testing
  'Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit', 'Pytest',
  
  // Others
  'WebSocket', 'RESTful APIs', 'Microservices', 'Serverless', 'Blockchain',
  'Machine Learning', 'Data Science', 'UI/UX Design'
]

const router = useRouter()
const EditProfileModal = defineAsyncComponent(() => import('../components/modals/EditProfileModal.vue'))
const AvatarPreviewModal = defineAsyncComponent(() => import('../components/modals/AvatarPreviewModal.vue'))
const DeleteConfirmationModal = defineAsyncComponent(() => import('../components/modals/DeleteConfirmationModal.vue'))
const ImagePreviewModal = defineAsyncComponent(() => import('../components/modals/ImagePreviewModal.vue'))

const userStore = useUserStore()
const profileStore = useProfileStore()
const { logProfilePictureUpdated } = useActivityLogger()
const imageCaption = ref('')
const photoUploadInput = ref<HTMLInputElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const showEditModal = ref(false)
const selectedImage = ref<{ id: string; url: string; caption: string } | null>(null)
const imageToDelete = ref<string | null>(null)
const animatedElements = ref<HTMLElement[]>([])
const imageError = ref('')
const showImageErrorModal = ref(false)
const showAddPhotoModal = ref(false)
const newPhotoData = ref<{ url: string, file: File } | null>(null)
const newPhotoCaption = ref('')

// Function to generate a simple hash from image data
const generateImageHash = (imageData: string): string => {
  const sampleSize = 1000;
  const step = Math.floor(imageData.length / sampleSize);
  let sample = '';
  for (let i = 0; i < imageData.length; i += step) {
    sample += imageData.charAt(i);
  }
  return sample;
};

// Check if an image is a duplicate
const isImageDuplicate = (imageUrl: string): boolean => {
  const newImageHash = generateImageHash(imageUrl);
  // Check if any existing image has the same hash
  return profileStore.userAlbum.some(image => {
    const existingHash = generateImageHash(image.url);
    return existingHash === newImageHash;
  });
};

const handleImageUpload = async (event: Event) => {
  imageError.value = ''
  showImageErrorModal.value = false
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = 'File size should not exceed 5MB'
      showImageErrorModal.value = true
      return
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      imageError.value = 'Only PNG and JPEG images are allowed'
      showImageErrorModal.value = true
      return
    }
    
    if (profileStore.userAlbum.length >= 4) {
      imageError.value = 'Maximum 4 images allowed in the album'
      showImageErrorModal.value = true
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string
        
        // Check for duplicate image
        if (isImageDuplicate(imageData)) {
          imageError.value = 'This image has already been uploaded'
          showImageErrorModal.value = true
          return
        }
        
        newPhotoData.value = { url: imageData, file }
        showAddPhotoModal.value = true
      }
    }

    reader.readAsDataURL(file)
  }
}

const handleAvatarUpload = async (event: Event) => {
  imageError.value = ''
  showImageErrorModal.value = false
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = 'File size should not exceed 5MB'
      showImageErrorModal.value = true
      return
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      imageError.value = 'Only PNG and JPEG images are allowed'
      showImageErrorModal.value = true
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        selectedImage.value = {
          id: 'avatar',
          url: e.target.result as string,
          caption: 'Profile Photo'
        }
        if (input) input.value = ''
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
    try {
      await userStore.updateAvatar(selectedImage.value.url)
      logProfilePictureUpdated()
      selectedImage.value = null
    } catch (error) {
      console.error('Failed to update avatar:', error)
    }
  }
}

const goToHome = () => {
  router.push('/home')
}

// Animation for elements
const checkElementsInViewport = () => {
  animatedElements.value.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('visible')
    }, index * 100)
  })
}

const handleAddPhotoConfirm = (caption: string) => {
  if (newPhotoData.value) {
    profileStore.addImage(newPhotoData.value.url, caption)
    logProfilePictureUpdated()
    newPhotoData.value = null
    showAddPhotoModal.value = false
  }
}

const handleAddPhotoCancel = () => {
  newPhotoData.value = null
  showAddPhotoModal.value = false
}

onMounted(() => {
  // Collect all elements with animate-on-scroll class
  animatedElements.value = Array.from(document.querySelectorAll('.animate-on-scroll'))
  
  // Initial check for elements in viewport
  setTimeout(() => {
    checkElementsInViewport()
  }, 100)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50/50">
    <!-- Background gradient -->
    <div class="fixed inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 -z-10"></div>

    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 lg:px-8 xl:px-12">
      <!-- Return Button -->
      <button
        @click="goToHome"
        class="mb-8 inline-flex items-center px-4 py-2 rounded-lg text-primary font-medium shadow-sm hover:shadow-md border border-primary/10 bg-white/80 backdrop-blur-sm transition-all duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Return to Home
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- Left Column: Profile Information -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Profile Info Section -->
          <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex flex-col md:flex-row gap-6 md:gap-8">
              <div class="relative flex-shrink-0 mx-auto md:mx-0">
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                  ref="avatarInput"
                />
                <div class="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-r from-primary to-secondary p-1 shadow-lg relative group">
                  <div
                    class="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white cursor-pointer relative z-10"
                    @click="() => avatarInput?.click()"
                  >
                    <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" :alt="profileStore.fullName" class="h-full w-full object-cover" />
                    <svg v-else class="h-16 w-16 md:h-20 md:w-20 text-gray-400 group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  
                  <!-- Hover Overlay -->
                  <div 
                    class="absolute inset-0 rounded-full flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer" 
                    @click="avatarInput?.click()"
                  >
                    <div class="absolute inset-0 rounded-full bg-black/40 backdrop-blur-sm"></div>
                    <div class="relative flex flex-col items-center justify-center text-white">
                      <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="text-white text-xs font-medium">Change Photo</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-1 text-center md:text-left">
                <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">{{ profileStore.fullName }}</h1>
                <p class="text-lg text-text-secondary font-medium mt-2">{{ userStore.currentUser?.email }}</p>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                  <span v-for="skill in profileStore.userSkills" :key="skill"
                    class="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 shadow-sm">
                    {{ skill }}
                  </span>
                </div>
                <button
                  @click="showEditModal = true"
                  class="mt-6 px-6 py-2.5 bg-primary rounded-xl text-white font-semibold hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <!-- About Me Section -->
          <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">About Me</h3>
              <button v-if="!profileStore.userBio" @click="showEditModal = true" class="text-sm text-primary hover:text-primary/80">
                Add bio
              </button>
            </div>
            <div v-if="profileStore.userBio" class="prose prose-lg max-w-none text-text-primary">
              <p class="text-gray-600 leading-relaxed">{{ profileStore.userBio }}</p>
            </div>
            <div v-else class="py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p class="text-gray-500 text-lg">No bio added yet</p>
              <button
                @click="showEditModal = true"
                class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your Bio
              </button>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Skills</h3>
              <button @click="showEditModal = true" class="text-sm text-primary hover:text-primary/80">
                {{ profileStore.userSkills.length ? 'Edit' : 'Add' }} skills
              </button>
            </div>
            <div v-if="profileStore.userSkills.length" class="flex flex-wrap gap-3">
              <span v-for="skill in profileStore.userSkills" :key="skill"
                class="px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 shadow-sm">
                {{ skill }}
              </span>
            </div>
            <div v-else class="py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p class="text-gray-500 text-lg">No skills added yet</p>
              <button
                @click="showEditModal = true"
                class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your Skills
              </button>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 animate-on-scroll opacity-0 translate-y-8">
            <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">Contact Information</h3>
            <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="p-4 rounded-xl bg-gray-50/80">
                <dt class="text-sm font-semibold text-text-secondary mb-2">Email</dt>
                <dd class="text-lg text-text-primary font-medium">{{ userStore.currentUser?.email }}</dd>
              </div>
              <div class="p-4 rounded-xl bg-gray-50/80">
                <dt class="text-sm font-semibold text-text-secondary mb-2">Full Name</dt>
                <dd class="text-lg text-text-primary font-medium">{{ profileStore.fullName }}</dd>
              </div>
            </dl>
          </div>

          <!-- Social Links Section -->
          <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 animate-on-scroll opacity-0 translate-y-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Social Links</h3>
              <button v-if="profileStore.profile?.githubUrl || profileStore.profile?.linkedinUrl" @click="showEditModal = true" class="text-sm text-primary hover:text-primary/80">
                Edit links
              </button>
            </div>
            <div class="flex flex-col space-y-4">
              <template v-if="profileStore.profile?.githubUrl || profileStore.profile?.linkedinUrl">
                <a
                  v-if="profileStore.profile?.githubUrl"
                  :href="profileStore.profile.githubUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center space-x-3 px-4 py-3 bg-gray-50/80 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow"
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
                  class="flex items-center space-x-3 px-4 py-3 bg-gray-50/80 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span class="text-gray-700 font-medium">LinkedIn Profile</span>
                </a>
              </template>
              <div v-else class="py-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p class="text-gray-500 text-lg mb-2">No social links added yet</p>
                <button
                  @click="showEditModal = true"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-200"
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
        <div class="lg:col-span-4 h-full">
          <div class="sticky top-6">
            <div class="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 animate-on-scroll opacity-0 translate-y-8">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Photo Album</h3>
                <button
                  v-if="!profileStore.isEditing && profileStore.userAlbum.length < 4"
                  @click="showEditModal = true"
                  class="inline-flex items-center px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-200"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="image in profileStore.userAlbum"
                  :key="image.id"
                  class="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  @click="selectedImage = image; showEditModal = false"
                >
                  <img
                    :src="image.url"
                    :alt="image.caption || 'Album photo'"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div class="flex justify-between items-end">
                        <div>
                          <p class="text-sm font-medium">{{ image.caption || 'No caption' }}</p>
                          <p class="text-xs opacity-75">{{ new Date(image.uploadedAt).toLocaleDateString() }}</p>
                        </div>
                        <div class="flex gap-1.5">
                          <button @click.stop="imageToDelete = image.id" class="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  v-if="profileStore.userAlbum.length < 4"
                  class="aspect-[4/3] rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/40 transition-colors duration-200 flex items-center justify-center cursor-pointer group bg-primary/5"
                  @click="triggerFileUpload"
                >
                  <div class="text-center p-4">
                    <svg class="w-10 h-10 mx-auto text-primary/40 group-hover:text-primary/60 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="mt-2 text-sm font-medium text-primary/70 group-hover:text-primary transition-colors duration-200">
                      {{ profileStore.userAlbum.length === 0 ? 'Add Your First Photo' : 'Add Photo' }}
                    </p>
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
              <div v-if="!profileStore.userAlbum.length" class="text-center py-8">
                <div class="mx-auto w-20 h-20 mb-4 text-primary/30">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-text-primary mb-2">Photo album is empty</h4>
                <p class="text-text-secondary mb-6 text-sm">Add up to 4 photos to showcase your work and personality</p>
              </div>
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
      <!-- Warning Modal for Image Error -->
      <div v-if="showImageErrorModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
          <h3 class="text-lg font-semibold text-yellow-600 mb-2">Image Upload Warning</h3>
          <p class="text-gray-800 mb-4">{{ imageError }}</p>
          <button @click="showImageErrorModal = false" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Close</button>
        </div>
      </div>
      <!-- Use the AddPhotoModal component -->
      <AddPhotoModal 
        :show="showAddPhotoModal"
        :image-url="newPhotoData?.url || ''"
        @confirm="handleAddPhotoConfirm"
        @cancel="handleAddPhotoCancel"
      />
    </div>
  </div>
</template>

<style scoped>
/* Animation classes */
.animate-on-scroll {
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: calc(var(--delay, 0) * 0.1s);
}

.animate-on-scroll.visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
</style>
