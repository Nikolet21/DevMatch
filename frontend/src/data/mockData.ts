import type { Developer, Chat, ChatPartner, ChatMessage, User, UserRegistrationData, Notification, Swipe, DbMatch, Report } from '../interfaces/interfaces'
import defaultAvatar from '../assets/default-avatar.svg'
import developerProfiles from '../assets/developer-profiles.svg'
import matchingFunctionality from '../assets/matching-functionality.svg'
import messagingSystem from '../assets/messaging-system.svg'
import { v4 as uuidv4 } from 'uuid'

export { defaultAvatar }

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
  // User reports
  {
    id: 1,
    reporterId: 'user123',
    reporterName: 'John Smith',
    targetId: '2',
    targetName: 'Bob Smith',
    type: 'user',
    reason: 'Inappropriate behavior',
    description: 'Sent messages containing offensive content and spam repeatedly.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: 'high'
  },
  {
    id: 2,
    reporterId: 'user789',
    reporterName: 'Emma Wilson',
    targetId: '3',
    targetName: 'Carol Davis',
    type: 'user',
    reason: 'Fake profile',
    description: 'Profile information doesn\'t match with the person\'s actual details. The education history seems fabricated and work experience cannot be verified.',
    status: 'resolved',
    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    resolvedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    resolution: 'User received a warning and updated their profile with accurate information.',
    priority: 'medium'
  },
  {
    id: 3,
    reporterId: 'user654',
    reporterName: 'Sarah Johnson',
    targetId: '1',
    targetName: 'Alice Johnson',
    type: 'user',
    reason: 'Harassment',
    description: 'Continuous unwanted messages despite being asked to stop. Has been sending threatening messages about my project work.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: 'high'
  },
  // Content reports
  {
    id: 4,
    reporterId: 'user246',
    reporterName: 'Daniel Martinez',
    targetId: '1',
    targetName: 'Alice Johnson',
    contentId: '2',
    contentTitle: 'UI/UX design for a fitness tracking app',
    type: 'content',
    reason: 'Copyright violation',
    description: 'This portfolio item contains designs that were stolen from my project. I have proof that I created these designs months before they were posted here.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    priority: 'high'
  },
  {
    id: 5,
    reporterId: 'user579',
    reporterName: 'Olivia Davis',
    targetId: '2',
    targetName: 'Bob Smith',
    contentId: '5',
    contentTitle: 'DevOps pipeline visualization for continuous deployment',
    type: 'content',
    reason: 'Inappropriate content',
    description: 'This portfolio item contains images with adult content that violates the platform guidelines.',
    status: 'resolved',
    dateSubmitted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    resolvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    resolution: 'Content was reviewed and removed for violating community standards.',
    priority: 'medium'
  },
  {
    id: 6,
    reporterId: 'user852',
    reporterName: 'Michael Roberts',
    targetId: '3',
    targetName: 'Carol Davis',
    contentId: '7',
    contentTitle: 'Enterprise Java application architecture overview',
    type: 'content',
    reason: 'Misinformation',
    description: 'This portfolio contains technical information that is dangerously incorrect and could lead to security vulnerabilities if followed.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    priority: 'medium'
  },
  {
    id: 7,
    reporterId: 'user951',
    reporterName: 'Jennifer Wilson',
    targetId: '1',
    targetName: 'Alice Johnson',
    contentId: '3',
    contentTitle: 'System design diagram for a microservices architecture',
    type: 'content',
    reason: 'Plagiarism',
    description: 'This diagram was directly copied from a published paper without attribution to the original authors.',
    status: 'pending',
    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
  }
]

// Updated mock chats
export const mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: ['currentUser', 'dev1'], // Chat with Alice
    messages: [
      createMockMessage('msg1', 'dev1', 'currentUser', `Hey ${currentUser.firstName}! I saw your profile and I love your React projects!`, new Date(Date.now() - 86400000), true),
      createMockMessage('msg2', 'currentUser', 'dev1', `Thanks ${getDeveloperName('dev1')}! I'm always looking to collaborate on interesting projects.`, new Date(Date.now() - 82800000), true),
      createMockMessage('msg3', 'dev1', 'currentUser', "Would you be interested in working on a TypeScript library together?", new Date(Date.now() - 3600000), false)
    ],
    unreadCount: 1,
    lastMessage: createMockMessage('msg3', 'dev1', 'currentUser', 'Would you be interested in working on a TypeScript library together?', new Date(Date.now() - 3600000))
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

// Special developer for testing match functionality
const davidKimId = "4"; // ID must be a string that matches David's developer ID

// Mock swipes data
export const mockSwipes: Swipe[] = [
  {
    id: uuidv4(),
    swiperId: davidKimId, // David Kim
    swipedId: "currentUser", // Nicole Keith
    isLiked: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  // Alice and Nicole have already matched
  {
    id: uuidv4(),
    swiperId: "currentUser", // Nicole
    swipedId: "1", // Alice
    isLiked: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
  },
  {
    id: uuidv4(),
    swiperId: "1", // Alice
    swipedId: "currentUser", // Nicole
    isLiked: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
]

// Mock database matches
export const mockDbMatches: DbMatch[] = [
  {
    id: uuidv4(),
    userAId: "currentUser", // Nicole
    userBId: "1", // Alice
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isConnected: true // Alice is already connected
  },
  {
    id: uuidv4(),
    userAId: "currentUser", // Nicole
    userBId: "4", // David Kim
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isConnected: false // David Kim is matched but not connected yet
  }
]
