import { defineStore } from 'pinia'
import { ref } from 'vue'
import { validateSettingsPasswordForm, validateSettingsEmailForm } from '@/utils/validation'
import type { SettingsError } from '@/interfaces/interfaces'

export { type SettingsError } from '@/interfaces/interfaces'

export const useSettingStore = defineStore('settings', () => {
  const isLoading = ref(false)
  const errors = ref<SettingsError>({})
  const successMessage = ref('')

  const validatePasswordChange = (currentPassword: string, newPassword: string, confirmPassword: string): boolean => {
    const validationErrors = validateSettingsPasswordForm(currentPassword, newPassword, confirmPassword)
    errors.value = validationErrors
    return Object.keys(validationErrors).length === 0
  }

  const validateEmailChange = (currentEmail: string, newEmail: string, confirmEmail: string): boolean => {
    const validationErrors = validateSettingsEmailForm(currentEmail, newEmail, confirmEmail)
    errors.value = validationErrors
    return Object.keys(validationErrors).length === 0
  }

  const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!validatePasswordChange(currentPassword, newPassword, confirmPassword)) {
      return
    }

    try {
      isLoading.value = true
      errors.value = {}
      await new Promise(resolve => setTimeout(resolve, 1000))

      successMessage.value = 'Password updated successfully'
    } catch (error) {
      errors.value.general = 'Failed to update password. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  const updateEmail = async (currentEmail: string, newEmail: string, confirmEmail: string) => {
    if (!validateEmailChange(currentEmail, newEmail, confirmEmail)) {
      return
    }

    try {
      isLoading.value = true
      errors.value = {}
      await new Promise(resolve => setTimeout(resolve, 1000))

      successMessage.value = 'Email updated successfully'
    } catch (error) {
      errors.value.general = 'Failed to update email. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  const clearMessages = () => {
    errors.value = {}
    successMessage.value = ''
  }

  return {
    isLoading,
    errors,
    successMessage,
    updatePassword,
    updateEmail,
    clearMessages
  }
})
