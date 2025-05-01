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

// Swipe data model for the database
export interface Swipe {
  id: string;
  swiperId: string; // ID of the user who swiped
  swipedId: string; // ID of the user who was swiped
  isLiked: boolean;
  createdAt: Date;
}

// Match data model for the database
export interface DbMatch {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: Date;
  isConnected?: boolean; // Flag to indicate if users have clicked 'Connect' to enable chat
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
  role?: 'admin' | 'user' | 'developer'
  status?: 'Active' | 'Inactive'
  skills?: string[]
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  album?: AlbumImage[]
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

export interface PrivacyState {
  mutedUsers: string[]
  blockedUsers: string[]
  isLoading: boolean
  error: string | null
  successMessage: string | null
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: Date
  link?: string
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  showToast: boolean
  currentToast: Notification | null
  notificationQueue: Notification[] // Queue for pending notifications
  processingQueue: boolean // Flag to track if we're currently processing the queue
}

export type ActivityCategory = 'Security' | 'Profile' | 'Matches' | 'Reports' | 'Privacy';

export type ActivityAction =
  // Security actions
  | 'Login'
  | 'Logout'
  | 'Password Changed'
  | 'Email Changed'
  | 'MFA Enabled'
  | 'MFA Disabled'
  | 'Login Attempt Failed'
  | 'Account Deleted'
  // Profile actions
  | 'Profile Updated'
  | 'Profile Picture Updated'
  // Match actions
  | 'Match Created'
  | 'Match Accepted'
  | 'Match Rejected'
  // Report actions
  | 'Report Submitted'
  // Privacy actions
  | 'User Muted'
  | 'User Unmuted'
  | 'User Blocked'
  | 'User Unblocked';

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  category: ActivityCategory;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>; // Optional additional data
}

// This maps action types to their categories for consistency
export const actionCategoryMap: Record<ActivityAction, ActivityCategory> = {
  // Security actions
  'Login': 'Security',
  'Logout': 'Security',
  'Password Changed': 'Security',
  'Email Changed': 'Security',
  'MFA Enabled': 'Security',
  'MFA Disabled': 'Security',
  'Login Attempt Failed': 'Security',
  'Account Deleted': 'Security',
  // Profile actions
  'Profile Updated': 'Profile',
  'Profile Picture Updated': 'Profile',
  // Match actions
  'Match Created': 'Matches',
  'Match Accepted': 'Matches',
  'Match Rejected': 'Matches',
  // Report actions
  'Report Submitted': 'Reports',
  // Privacy actions
  'User Muted': 'Privacy',
  'User Unmuted': 'Privacy',
  'User Blocked': 'Privacy',
  'User Unblocked': 'Privacy'
};

// Report interface for user reporting system
export interface Report {
  id: number
  reporterId: string
  reporterName: string
  targetId: string
  targetName: string
  reason: string
  description: string
  status: 'pending' | 'investigating' | 'resolved'
  dateSubmitted: Date
  resolvedDate?: Date
  resolution?: string
  priority: 'high' | 'medium' | 'low'
}
