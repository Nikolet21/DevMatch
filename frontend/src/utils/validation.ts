export interface ValidationError {
  field: string
  message: string
}

export interface ProfileFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  skills?: string
  general?: string
}

export const validateProfileForm = (form: {
  firstName: string
  lastName: string
  email: string
  bio: string
  githubUrl?: string
  linkedinUrl?: string
  skills: string[]
}): ProfileFormErrors => {
  const errors: ProfileFormErrors = {}

  // First Name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
  } else if (form.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters long'
  }

  // Last Name validation
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
  } else if (form.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long'
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
  }

  // Bio validation
  if (form.bio.trim() && form.bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters'
  }

  // GitHub URL validation
  if (form.githubUrl) {
    const githubRegex = /^https?:\/\/(?:www\.)?github\.com\/[\w-]+(?:\/[\w.-]+)*\/?$/
    if (!githubRegex.test(form.githubUrl)) {
      errors.githubUrl = 'Please enter a valid GitHub profile URL'
    }
  }

  // LinkedIn URL validation
  if (form.linkedinUrl) {
    const linkedinRegex = /^https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+(?:\/[\w.-]+)*\/?$/
    if (!linkedinRegex.test(form.linkedinUrl)) {
      errors.linkedinUrl = 'Please enter a valid LinkedIn profile URL'
    }
  }

  // Skills validation
  if (form.skills.length === 0) {
    errors.skills = 'Please add at least one skill'
  }

  return errors
}

export const hasErrors = (errors: ProfileFormErrors): boolean => {
  return Object.keys(errors).length > 0
}
