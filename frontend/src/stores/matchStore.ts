import { defineStore } from 'pinia'
import type { Developer, Match, MatchState } from '../interfaces/interfaces'
import { mockDevelopers, mockMatches } from '../data/mockData'

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
        const processedDeveloperIds = this.matches.map(match => match.developer.id)

        const availableDevelopers = mockDevelopers.filter(dev =>
          !processedDeveloperIds.includes(dev.id) &&
          !this.potentialMatches.some(match => match.id === dev.id)
        )

        const shuffledDevelopers = [...availableDevelopers].sort(() => Math.random() - 0.5)

        this.potentialMatches = [...this.potentialMatches, ...shuffledDevelopers]
      } catch (error) {
        this.error = 'Failed to fetch potential matches'
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },

    async likeDeveloper(developerId: number) {
      try {
        const developer = this.potentialMatches[this.currentIndex]
        if (!developer) return

        const newMatch: Match = {
          id: Date.now(),
          developer: developer,
          status: 'pending',
          matchedAt: new Date()
        }

        this.matches.push(newMatch)
        this.stats.likesSent++

        this.moveToNextDeveloper()
      } catch (error) {
        this.error = 'Failed to like developer'
        console.error(error)
      }
    },

    async passDeveloper(developerId: number) {
      try {
        const developer = this.potentialMatches[this.currentIndex]
        if (!developer) return

        const newMatch: Match = {
          id: Date.now(),
          developer: developer,
          status: 'rejected',
          matchedAt: new Date()
        }

        this.matches.push(newMatch)
        this.moveToNextDeveloper()
      } catch (error) {
        this.error = 'Failed to pass developer'
        console.error(error)
      }
    },

    moveToNextDeveloper() {
      if (this.currentIndex < this.potentialMatches.length) {
        this.potentialMatches.splice(this.currentIndex, 1)

        if (this.potentialMatches.length < 5) {
          this.fetchPotentialMatches()
        }

        this.currentIndex = 0
      }
    },

    async fetchMatches() {
      if (this.isLoading) return

      this.isLoading = true
      this.error = null
      try {
        // mock data atm
        const mappedMatches: Match[] = mockMatches.map(match => {
          const developer = mockDevelopers.find(dev => dev.id === match.developerId) || {
            id: match.developerId,
            name: 'Unknown Developer',
            email: '',
            avatar: '/default-avatar.png',
            location: 'Unknown Location',
            skills: [],
            bio: 'No bio available'
          }
          return {
            id: match.id,
            developer,
            matchedAt: new Date(match.matchedAt),
            status: match.status as 'accepted' | 'rejected' | 'pending'
          }
        })

        this.matches = mappedMatches
        this.stats.totalMatches = this.matches.filter(m => m.status === 'accepted').length
      } catch (error) {
        this.error = 'Failed to fetch matches'
        console.error('Error fetching matches:', error)
      } finally {
        this.isLoading = false
      }
    },

    async updateMatchStatus(matchId: number, status: 'accepted' | 'rejected') {
      try {
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
