import type { Developer, Chat, ChatPartner, ChatMessage, User, UserRegistrationData, Notification } from '../interfaces/interfaces'
import defaultAvatar from '../assets/default-avatar.svg'
import developerProfiles from '../assets/developer-profiles.svg'
import matchingFunctionality from '../assets/matching-functionality.svg'
import messagingSystem from '../assets/messaging-system.svg'

export { defaultAvatar }

// Report interface
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

// Admin account
export const adminAccount = {
  email: 'admin@devmatch.com',
  password: 'Admin@123',
  firstName: 'DevMatch',
  lastName: 'Administrator',
  role: 'admin'
}

// Mock reports data for admin panel
export const mockReports: Report[] = [
  {
    id: 1,
    reporterId: 'user123',
    reporterName: 'John Smith',
    targetId: 'user456',
    targetName: 'Michael Johnson',
    reason: 'Inappropriate messages',
    description: 'Sent messages containing offensive content and spam.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: 'high'
  },
  {
    id: 2,
    reporterId: 'user789',
    reporterName: 'Emma Wilson',
    targetId: 'user321',
    targetName: 'David Lee',
    reason: 'Fake profile',
    description: 'Profile information doesn\'t match with the person\'s actual details.',
    status: 'resolved',
    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    resolvedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    resolution: 'Profile removed',
    priority: 'medium'
  },
  {
    id: 3,
    reporterId: 'user654',
    reporterName: 'Sarah Johnson',
    targetId: 'user987',
    targetName: 'Robert Brown',
    reason: 'Harassment',
    description: 'Continuous unwanted messages despite being asked to stop.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: 'high'
  },
  {
    id: 4,
    reporterId: 'user246',
    reporterName: 'Daniel Martinez',
    targetId: 'user135',
    targetName: 'Jason Wilson',
    reason: 'Inappropriate project suggestion',
    description: 'Suggested illegal project and requested collaboration.',
    status: 'investigating',
    dateSubmitted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    priority: 'medium'
  },
  {
    id: 5,
    reporterId: 'user579',
    reporterName: 'Olivia Davis',
    targetId: 'user864',
    targetName: 'Laura Thompson',
    reason: 'Unresponsiveness',
    description: 'Agreed to collaborate but never responded to messages.',
    status: 'resolved',
    dateSubmitted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    resolvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    resolution: 'Warning issued',
    priority: 'low'
  }
]

export const mockUsers: UserRegistrationData[] = [
  {
    firstName: 'Nicole Keith',
    lastName: 'Inot',
    email: 'nicole.inot@example.com',
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
    linkedinUrl: 'https://linkedin.com/in/alice',
    album: [
      {
        id: '1',
        url: developerProfiles,
        caption: 'A modern dashboard built with React and TypeScript',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        url: matchingFunctionality,
        caption: 'UI/UX design for a fitness tracking app',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        url: messagingSystem,
        caption: 'System design diagram for a microservices architecture',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ]
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
    linkedinUrl: 'https://linkedin.com/in/bob',
    album: [
      {
        id: '4',
        url: developerProfiles,
        caption: 'Cloud architecture diagram for a scalable microservices platform',
        uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        url: matchingFunctionality,
        caption: 'DevOps pipeline visualization for continuous deployment',
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: '6',
        url: messagingSystem,
        caption: 'Docker container orchestration setup for a Vue.js application',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]
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
    linkedinUrl: 'https://linkedin.com/in/carol',
    album: [
      {
        id: '7',
        url: developerProfiles,
        caption: 'Enterprise Java application architecture overview',
        uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        id: '8',
        url: matchingFunctionality,
        caption: 'Angular-based dashboard for monitoring Spring Boot services',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '9',
        url: messagingSystem,
        caption: 'System integration diagram for a distributed enterprise system',
        uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: defaultAvatar,
    location: 'Austin, TX',
    skills: ['React Native', 'Swift', 'Kotlin'],
    bio: 'Mobile app developer specializing in cross-platform development.',
    githubUrl: 'https://github.com/davidkim',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    album: [
      {
        id: '10',
        url: developerProfiles,
        caption: 'Cross-platform mobile app showcase',
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 5,
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: defaultAvatar,
    location: 'Portland, OR',
    skills: ['Svelte', 'GraphQL', 'PostgreSQL'],
    bio: 'Full-stack developer passionate about modern web technologies.',
    githubUrl: 'https://github.com/emmaw',
    linkedinUrl: 'https://linkedin.com/in/emmawilson',
    album: [
      {
        id: '11',
        url: developerProfiles,
        caption: 'Real-time data visualization dashboard',
        uploadedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 6,
    name: 'Frank Chen',
    email: 'frank.chen@example.com',
    avatar: defaultAvatar,
    location: 'Boston, MA',
    skills: ['Ruby on Rails', 'Redis', 'AWS'],
    bio: 'Backend developer focused on scalable cloud solutions.',
    githubUrl: 'https://github.com/frankc',
    linkedinUrl: 'https://linkedin.com/in/frankchen',
    album: [
      {
        id: '12',
        url: developerProfiles,
        caption: 'High-performance caching system architecture',
        uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 7,
    name: 'Grace Lee',
    email: 'grace.lee@example.com',
    avatar: defaultAvatar,
    location: 'Chicago, IL',
    skills: ['Unity', 'C#', 'WebGL'],
    bio: 'Game developer with expertise in 3D graphics and physics engines.',
    githubUrl: 'https://github.com/gracelee',
    linkedinUrl: 'https://linkedin.com/in/gracel',
    album: [
      {
        id: '13',
        url: developerProfiles,
        caption: '3D game development portfolio',
        uploadedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 8,
    name: 'Henry Martinez',
    email: 'henry.martinez@example.com',
    avatar: defaultAvatar,
    location: 'Miami, FL',
    skills: ['Solidity', 'Web3.js', 'Ethereum'],
    bio: 'Blockchain developer specializing in smart contracts and DeFi applications.',
    githubUrl: 'https://github.com/henrym',
    linkedinUrl: 'https://linkedin.com/in/henrymartinez',
    album: [
      {
        id: '14',
        url: developerProfiles,
        caption: 'Decentralized finance application architecture',
        uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      }
    ]
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

export const mockMatches = [
  {
    id: 1,
    developerId: 1,
    status: 'accepted',
    matchedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    developerId: 2,
    status: 'pending',
    matchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 3,
    developerId: 3,
    status: 'accepted',
    matchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
]

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

// Create mock notifications with different types and timestamps
export const mockNotifications: Notification[] = [
  {
    id: 'notification-1',
    title: 'New Match!',
    message: 'You have a new match with Sarah Developer',
    type: 'info',
    read: false,
    timestamp: new Date(),
    link: '/home/matches'
  },
  {
    id: 'notification-2',
    title: 'Message Received',
    message: 'John Smith sent you a message',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    link: '/home/chat'
  },
  {
    id: 'notification-3',
    title: 'Profile Updated',
    message: 'Your profile has been successfully updated',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    link: '/profile'
  },
  {
    id: 'notification-4',
    title: 'Subscription Ending',
    message: 'Your premium subscription will end in 3 days',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    link: '/settings'
  },
  {
    id: 'notification-5',
    title: 'Payment Failed',
    message: 'Your last payment method was declined',
    type: 'error',
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    link: '/settings'
  },
  {
    id: 'notification-6',
    title: 'Security Alert',
    message: 'Your account was accessed from a new device',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    link: '/settings'
  },
  {
    id: 'notification-7',
    title: 'New Feature Available',
    message: 'Try our new AI-powered match recommendations',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    link: '/home'
  }
]
