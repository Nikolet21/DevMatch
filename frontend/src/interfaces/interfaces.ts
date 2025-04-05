export interface Developer {
  id: number
  name: string
  avatar: string
  location: string
  skills: string[]
  bio: string
  githubUrl?: string
  linkedinUrl?: string
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
