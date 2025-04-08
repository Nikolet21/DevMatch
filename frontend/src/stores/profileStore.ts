import { defineStore } from 'pinia'
import type { Profile, ProfileState, AlbumImage } from '../interfaces/interfaces'
import { useUserStore } from './userStore'
import { defaultAvatar } from '../data/mockData'


export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: null,
    isEditing: false,
    error: null,
    editForm: {
      firstName: '',
      lastName: '',
      email: '',
      skills: [],
      bio: '',
      album: []
    }
  }),

  getters: {
    fullName: (state): string => {
      const userStore = useUserStore()
      if (userStore.user?.firstName && userStore.user?.lastName) {
        return `${userStore.user.firstName} ${userStore.user.lastName}`
      } else if (state.isEditing && state.editForm.firstName && state.editForm.lastName) {
        return `${state.editForm.firstName} ${state.editForm.lastName}`
      } else if (state.profile?.firstName && state.profile?.lastName) {
        return `${state.profile.firstName} ${state.profile.lastName}`
      }
      return 'Anonymous User'
    },
    userSkills: (state): string[] => state.profile?.skills || [],
    userBio: (state): string =>
      state.profile?.bio ||
      'Passionate developer with a love for creating beautiful and functional web applications.',
    userAlbum: (state): AlbumImage[] => state.profile?.album || []
  },

  actions: {
    async updateProfile(updatedProfile: Partial<Profile>) {
      try {
        // TODO: Implement API call to update profile
        const userStore = useUserStore()
        this.profile = {
          ...this.profile,
          ...updatedProfile,
          avatar: userStore.user?.avatar || defaultAvatar
        } as Profile
        this.error = null
      } catch (err) {
        this.error = 'Failed to update profile'
        throw err
      }
    },

    setProfile(newProfile: Profile) {
      const userStore = useUserStore()
      this.profile = {
        ...newProfile,
        avatar: userStore.user?.avatar || defaultAvatar
      }
    },

    setIsEditing(value: boolean) {
      this.isEditing = value
      if (value) {
        this.editForm = {
          firstName: this.profile?.firstName || '',
          lastName: this.profile?.lastName || '',
          email: this.profile?.email || '',
          skills: this.profile?.skills || [],
          bio: this.profile?.bio || '',
          album: this.profile?.album || []
        }
      }
    },

    addSkill(skill: string) {
      if (skill.trim() && !this.editForm.skills.includes(skill.trim())) {
        this.editForm.skills.push(skill.trim())
      }
    },

    removeSkill(index: number) {
      this.editForm.skills.splice(index, 1)
    },

    cancelEdit() {
      this.editForm = {
        firstName: this.profile?.firstName || '',
        lastName: this.profile?.lastName || '',
        email: this.profile?.email || '',
        skills: this.profile?.skills || [],
        bio: this.profile?.bio || '',
        album: this.profile?.album || []
      }
      this.isEditing = false
    },

    clearError() {
      this.error = null
    },

    addImage(imageUrl: string, caption?: string) {
      const newImage: AlbumImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        caption: caption || '',
        uploadedAt: new Date()
      }
      if (this.isEditing) {
        this.editForm.album.push(newImage)
      } else if (this.profile) {
        this.profile.album = [...(this.profile.album || []), newImage]
      }
    },

    removeImage(imageId: string) {
      if (this.isEditing) {
        this.editForm.album = this.editForm.album.filter(img => img.id !== imageId)
      } else if (this.profile) {
        this.profile.album = this.profile.album.filter(img => img.id !== imageId)
      }
    },

    updateImageCaption(imageId: string, caption: string) {
      if (this.isEditing) {
        const image = this.editForm.album.find(img => img.id === imageId)
        if (image) image.caption = caption
      } else if (this.profile) {
        const image = this.profile.album.find(img => img.id === imageId)
        if (image) image.caption = caption
      }
    }
  }
})
