export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
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

export interface LoginFormErrors {
  email?: string
  password?: string
}

export interface RegisterFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required'
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    }
  }

  return {
    isValid: true
  }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required'
    }
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must meet all requirements'
    }
  }

  return {
    isValid: true
  }
}

export const validatePasswordRequirements = (password: string) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
}

export const validateLoginForm = (form: {
  email: string
  password: string
}): LoginFormErrors => {
  const errors: LoginFormErrors = {}

  // Email validation
  const emailValidation = validateEmail(form.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  // Password validation (simple check for login)
  if (!form.password) {
    errors.password = 'Password is required'
  }

  return errors
}

export const validateRegisterForm = (form: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}): RegisterFormErrors => {
  const errors: RegisterFormErrors = {}

  // First Name validation
  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required'
  }

  // Last Name validation
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required'
  }

  // Email validation
  const emailValidation = validateEmail(form.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  // Password validation
  const passwordValidation = validatePassword(form.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  // Confirm Password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export interface SettingsFormErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  currentEmail?: string
  newEmail?: string
  confirmEmail?: string
  general?: string
}

export const validateSettingsPasswordForm = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): SettingsFormErrors => {
  const errors: SettingsFormErrors = {}

  if (!currentPassword) {
    errors.currentPassword = 'Current password is required'
  }

  if (!newPassword) {
    errors.newPassword = 'New password is required'
  } else {
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      errors.newPassword = passwordValidation.error
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password'
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

export const validateSettingsEmailForm = (
  currentEmail: string,
  newEmail: string,
  confirmEmail: string
): SettingsFormErrors => {
  const errors: SettingsFormErrors = {}

  const currentEmailValidation = validateEmail(currentEmail)
  if (!currentEmailValidation.isValid) {
    errors.currentEmail = currentEmailValidation.error
  }

  const newEmailValidation = validateEmail(newEmail)
  if (!newEmailValidation.isValid) {
    errors.newEmail = newEmailValidation.error
  }

  if (!confirmEmail) {
    errors.confirmEmail = 'Please confirm your new email'
  } else if (newEmail !== confirmEmail) {
    errors.confirmEmail = 'Email addresses do not match'
  }

  return errors
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
  const emailValidation = validateEmail(form.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
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
