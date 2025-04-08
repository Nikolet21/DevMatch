import type { Developer, Chat, ChatPartner, ChatMessage, User, UserRegistrationData } from '../interfaces/interfaces'
import defaultAvatar from '../assets/default-avatar.svg'

export { defaultAvatar }

export const mockUsers: UserRegistrationData[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  },
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    password: 'password123'
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@example.com',
    password: 'password123'
  },
  {
    firstName: 'Carol',
    lastName: 'Davis',
    email: 'carol.davis@example.com',
    password: 'password123'
  }
]

export const currentUser: User = {
  id: 'currentUser',
  firstName: mockUsers[0].firstName,
  lastName: mockUsers[0].lastName,
  email: mockUsers[0].email
}

export const mockDevelopers: Developer[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: defaultAvatar,
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'Node.js'],
    bio: 'Full-stack developer with 5 years of experience in web development.',
    githubUrl: 'https://github.com/alice',
    linkedinUrl: 'https://linkedin.com/in/alice'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    avatar: defaultAvatar,
    location: 'New York, NY',
    skills: ['Vue.js', 'Python', 'Docker'],
    bio: 'Backend developer passionate about cloud architecture and DevOps.',
    githubUrl: 'https://github.com/bob',
    linkedinUrl: 'https://linkedin.com/in/bob'
  },
  {
    id: 3,
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    avatar: defaultAvatar,
    location: 'Seattle, WA',
    skills: ['Angular', 'Java', 'Spring Boot'],
    bio: 'Senior software engineer specializing in enterprise applications.',
    githubUrl: 'https://github.com/carol',
    linkedinUrl: 'https://linkedin.com/in/carol'
  }
]

export const mockChatPartners: ChatPartner[] = [
  {
    id: 'currentUser',
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    avatar: defaultAvatar,
    isOnline: true,
    lastSeen: new Date()
  },
  ...mockDevelopers.map(dev => ({
    id: `dev${dev.id}`,
    name: dev.name,
    avatar: defaultAvatar,
    isOnline: Math.random() > 0.5,
    lastSeen: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000))
  }))
]

const createMockMessage = (id: string, senderId: string, receiverId: string, content: string, timestamp: Date, isRead: boolean = false): ChatMessage => ({
  id,
  senderId,
  receiverId,
  content,
  timestamp,
  isRead: false
})

// Helper function to get developer name by ID
const getDeveloperName = (id: string): string => {
  const devId = parseInt(id.replace('dev', ''))
  return mockDevelopers.find(dev => dev.id === devId)?.name || 'Unknown User'
}

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: ['currentUser', 'dev1'],
    messages: [
      createMockMessage('msg1', 'dev1', 'currentUser', `Hey ${currentUser.firstName}! I saw your profile and I love your React projects!`, new Date(Date.now() - 86400000), true),
      createMockMessage('msg2', 'currentUser', 'dev1', `Thanks ${getDeveloperName('dev1')}! I'm always looking to collaborate on interesting projects.`, new Date(Date.now() - 82800000), true),
      createMockMessage('msg3', 'dev1', 'currentUser', "Would you be interested in working on a TypeScript library together?", new Date(Date.now() - 3600000), false)
    ],
    unreadCount: 1,
    lastMessage: createMockMessage('msg3', 'dev1', 'currentUser', 'Would you be interested in working on a TypeScript library together?', new Date(Date.now() - 3600000))
  },
  {
    id: 'chat2',
    participants: ['currentUser', 'dev2'],
    messages: [
      createMockMessage('msg4', 'currentUser', 'dev2', `Hi ${getDeveloperName('dev2')}, I see you're working with Vue.js!`, new Date(Date.now() - 172800000), true),
      createMockMessage('msg5', 'dev2', 'currentUser', "Yes! I'm currently building a new component library.", new Date(Date.now() - 169200000), true)
    ],
    unreadCount: 0,
    lastMessage: createMockMessage('msg5', 'dev2', 'currentUser', "Yes! I'm currently building a new component library.", new Date(Date.now() - 169200000)),
  },
  {
    id: 'chat3',
    participants: ['currentUser', 'dev3'],
    messages: [
      createMockMessage('msg6', 'dev3', 'currentUser', "Hello! Looking for Java developers?", new Date(Date.now() - 7200000), true),
      createMockMessage('msg7', 'currentUser', 'dev3', `Actually yes ${getDeveloperName('dev3')}! We have an exciting Spring Boot project.`, new Date(Date.now() - 5400000), true),
      createMockMessage('msg8', 'dev3', 'currentUser', "Perfect! When can we discuss the details?", new Date(Date.now() - 1800000), false)
    ],
    unreadCount: 2,
    lastMessage: createMockMessage('msg8', 'dev3', 'currentUser', 'Perfect! When can we discuss the details?', new Date(Date.now() - 1800000))
  }
]
