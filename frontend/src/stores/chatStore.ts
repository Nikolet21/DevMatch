import { defineStore } from 'pinia'
import type { ChatMessage, ChatPartner, Chat } from '../interfaces/interfaces'
import { mockChats, mockChatPartners, mockDevelopers } from '../data/mockData'

export interface ChatState {
  activeChats: Chat[]
  chatPartners: ChatPartner[]
  selectedChatId: string | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    activeChats: [],
    chatPartners: [],
    selectedChatId: null
  }),

  getters: {
    sortedChats: (state): Chat[] => {
      return [...state.activeChats].sort((a, b) => {
        const aTime = a.lastMessage?.timestamp || new Date(0)
        const bTime = b.lastMessage?.timestamp || new Date(0)
        return bTime.getTime() - aTime.getTime()
      })
    },
    selectedChat: (state): Chat | undefined =>
      state.activeChats.find(chat => chat.id === state.selectedChatId),
    getUnreadCount: (state) => (chatId: string): number => {
      const chat = state.activeChats.find(c => c.id === chatId)
      return chat?.unreadCount || 0
    },
    getChatPartner: (state) => (chatId: string): ChatPartner | undefined => {
      const chat = state.activeChats.find(c => c.id === chatId)
      if (!chat) return undefined
      const partnerId = chat.participants.find(id => id !== 'currentUser')
      return partnerId ? state.chatPartners.find(p => p.id === partnerId) : undefined
    }
  },

  actions: {
    sendMessage(chatId: string, content: string, senderId: string, receiverId: string) {
      const chat = this.activeChats.find(c => c.id === chatId)
      if (!chat) return

      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId,
        receiverId,
        content,
        timestamp: new Date(),
        isRead: false
      }

      chat.messages.push(newMessage)
      chat.lastMessage = newMessage
      // Here you would typically also send the message to your backend
    },

    markMessagesAsRead(chatId: string) {
      const chat = this.activeChats.find(c => c.id === chatId)
      if (!chat) return

      chat.messages.forEach(message => {
        message.isRead = true
      })
      chat.unreadCount = 0
    },

    selectChat(chatId: string) {
      this.selectedChatId = chatId
      this.markMessagesAsRead(chatId)
    },

    updatePartnerStatus(partnerId: string, isOnline: boolean) {
      const partner = this.chatPartners.find(p => p.id === partnerId)
      if (partner) {
        partner.isOnline = isOnline
        if (!isOnline) {
          partner.lastSeen = new Date()
        }
      }
    },

    async initializeChat(partnerId: string) {
      // Find the chat partner from mockDevelopers
      const partner = mockDevelopers.find(dev => dev.id.toString() === partnerId)
      if (!partner) return

      // Update or create chat partner information
      const chatPartner: ChatPartner = {
        id: partnerId,
        name: partner.name,
        avatar: partner.avatar,
        isOnline: true,
        lastSeen: new Date()
      }

      // Check if chat already exists in mockChats
      const mockChat = mockChats.find(chat =>
        chat.participants.includes(partnerId) && chat.participants.includes('currentUser')
      )

      // Initialize state if empty
      if (this.activeChats.length === 0) {
        this.activeChats = [...mockChats]
        this.chatPartners = [...mockChatPartners]
      }

      // Check if chat exists in current state
      let existingChat = this.activeChats.find(chat =>
        chat.participants.includes(partnerId) && chat.participants.includes('currentUser')
      )

      const existingPartnerIndex = this.chatPartners.findIndex(p => p.id === partnerId)
      if (existingPartnerIndex !== -1) {
        // Update existing partner
        this.chatPartners[existingPartnerIndex] = {
          ...this.chatPartners[existingPartnerIndex],
          ...chatPartner
        }
      } else {
        // Add new partner
        this.chatPartners.push(chatPartner)
      }

      if (!existingChat) {
        // Create new chat if it doesn't exist
        const newChat: Chat = mockChat || {
          id: crypto.randomUUID(),
          participants: ['currentUser', partnerId],
          messages: [],
          unreadCount: 0,
          lastMessage: undefined
        }
        this.activeChats.push(newChat)
        existingChat = newChat
      }

      // Select the chat
      this.selectChat(existingChat.id)
    }
  }
})
