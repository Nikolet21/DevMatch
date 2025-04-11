import { defineStore } from 'pinia'
import type { Developer, Match, MatchState } from '../interfaces/interfaces'
import { mockDevelopers } from '../data/mockData'


export const useMatchStore = defineStore('match', {
  state: (): MatchState => ({
    potentialMatches: [],
    matches: [],
    currentIndex: 0,
    isLoading: false,
    error: null,
    stats: {
      likesReceived: 0,
      likesSent: 0,
      totalMatches: 0
    }
  }),

  getters: {
    currentDeveloper: (state): Developer | null => {
      return state.potentialMatches[state.currentIndex] || null
    },
    recentMatches: (state): Match[] => {
      return state.matches
        .filter(match => match.status === 'accepted')
        .sort((a, b) => b.matchedAt.getTime() - a.matchedAt.getTime())
        .slice(0, 3)
    },
    matchStats: (state) => state.stats
  },

  actions: {
    async fetchPotentialMatches() {
      this.isLoading = true
      this.error = null
      try {
        // Use mock data from mockData.ts for development
        this.potentialMatches = mockDevelopers
      } catch (error) {
        this.error = 'Failed to fetch potential matches'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async likeDeveloper(developerId: number) {
      try {
        // Mock API call for development
        this.stats.likesSent++
        this.moveToNextDeveloper()
      } catch (error) {
        this.error = 'Failed to like developer'
        console.error(error)
      }
    },

    async passDeveloper(developerId: number) {
      try {
        // Mock API call for development
        this.moveToNextDeveloper()
      } catch (error) {
        this.error = 'Failed to pass developer'
        console.error(error)
      }
    },

    moveToNextDeveloper() {
      // Remove the current card from potential matches
      this.potentialMatches.splice(this.currentIndex, 1)

      // If we don't have enough cards left, fetch more
      if (this.potentialMatches.length < 3) {
        this.fetchPotentialMatches()
      }
    },

    async fetchMatches() {
      this.isLoading = true
      this.error = null
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/matches')
        const data = await response.json()
        this.matches = data
        this.stats.totalMatches = this.matches.filter(m => m.status === 'accepted').length
      } catch (error) {
        this.error = 'Failed to fetch matches'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async updateMatchStatus(matchId: number, status: 'accepted' | 'rejected') {
      try {
        // TODO: Replace with actual API call
        await fetch(`/api/matches/${matchId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status })
        })

        const match = this.matches.find(m => m.id === matchId)
        if (match) {
          match.status = status
          if (status === 'accepted') {
            this.stats.totalMatches++
          }
        }
      } catch (error) {
        this.error = 'Failed to update match status'
        console.error(error)
      }
    }
  }
})
