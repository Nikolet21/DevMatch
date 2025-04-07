import { defineStore } from 'pinia'
import type { ChatMessage, ChatPartner, Chat } from '../interfaces/interfaces'
import { mockChats, mockChatPartners } from '../data/mockData'

export interface ChatState {
  activeChats: Chat[]
  chatPartners: ChatPartner[]
  selectedChatId: string | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    activeChats: mockChats,
    chatPartners: mockChatPartners,
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
    }
  }
})
