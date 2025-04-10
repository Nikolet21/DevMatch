export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
}

export interface ChatPartner {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface Chat {
  id: string
  participants: string[]
  messages: ChatMessage[]
  unreadCount: number
  lastMessage?: ChatMessage
}

export interface Developer {
  id: number
  name: string
  email: string
  avatar: string
  location: string
  skills: string[]
  bio: string
  githubUrl?: string
  linkedinUrl?: string
  album?: AlbumImage[]
}

export interface AlbumImage {
  id: string
  url: string
  caption: string
  uploadedAt: Date
}

export interface Match {
  id: number
  developer: Developer
  matchedAt: Date
  status: 'pending' | 'accepted' | 'rejected'
  lastMessage?: string
  lastMessageAt?: Date
}

export interface MatchState {
  potentialMatches: Developer[]
  matches: Match[]
  currentIndex: number
  isLoading: boolean
  error: string | null
  stats: {
    likesReceived: number
    likesSent: number
    totalMatches: number
  }
}

export interface User {
  id?: string
  firstName?: string
  lastName?: string
  email: string
  avatar?: string
}

export interface Profile extends User {
  skills: string[]
  bio: string
  album: AlbumImage[]
  githubUrl?: string
  linkedinUrl?: string
}


export interface ProfileEditForm {
  firstName: string
  lastName: string
  email: string
  skills: string[]
  bio: string
  album: AlbumImage[]
  githubUrl?: string
  linkedinUrl?: string
}

export interface ProfileState {
  profile: Profile | null
  isEditing: boolean
  error: string | null
  editForm: ProfileEditForm
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  error: string | null
}

export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface SettingsError {
  password?: string
  email?: string
  general?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  currentEmail?: string
  newEmail?: string
  confirmEmail?: string
}
