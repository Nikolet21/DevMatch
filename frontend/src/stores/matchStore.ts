import { defineStore } from 'pinia'

import type { Developer, Match, MatchState } from '../interfaces/interfaces'


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
        // Mock data for development
        const mockDevelopers: Developer[] = [
          {
            id: 1,
            name: 'Alice Johnson',
            bio: 'Full Stack Developer with 5 years of experience in React and Node.js. Passionate about building scalable web applications and mentoring junior developers.',
            location: 'San Francisco, CA',
            skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
            avatar: 'https://i.pravatar.cc/300?img=1'
          },
          {
            id: 2,
            name: 'Bob Smith',
            bio: 'Backend Developer specializing in Go and distributed systems. Love solving complex architectural challenges and optimizing system performance.',
            location: 'Seattle, WA',
            skills: ['Go', 'Docker', 'Kubernetes', 'PostgreSQL', 'gRPC'],
            avatar: 'https://i.pravatar.cc/300?img=2'
          },
          {
            id: 3,
            name: 'Carol White',
            bio: 'Frontend Developer passionate about UI/UX and accessibility. Creating beautiful and inclusive web experiences is my mission.',
            location: 'New York, NY',
            skills: ['Vue.js', 'CSS', 'Tailwind', 'Jest', 'Figma'],
            avatar: 'https://i.pravatar.cc/300?img=3'
          },
          {
            id: 4,
            name: 'David Chen',
            bio: 'Mobile Developer with expertise in React Native and Flutter. Building cross-platform apps that feel native and perform seamlessly.',
            location: 'Austin, TX',
            skills: ['React Native', 'Flutter', 'Firebase', 'Redux', 'GraphQL'],
            avatar: 'https://i.pravatar.cc/300?img=4'
          },
          {
            id: 5,
            name: 'Emma Davis',
            bio: 'DevOps Engineer focused on CI/CD and cloud infrastructure. Automating everything that can be automated!',
            location: 'Portland, OR',
            skills: ['AWS', 'Terraform', 'Jenkins', 'Ansible', 'Python'],
            avatar: 'https://i.pravatar.cc/300?img=5'
          },
          {
            id: 6,
            name: 'Frank Miller',
            bio: 'Security Engineer specializing in web application security and penetration testing. Making the web a safer place one test at a time.',
            location: 'Boston, MA',
            skills: ['Penetration Testing', 'OWASP', 'Python', 'Burp Suite', 'Metasploit'],
            avatar: 'https://i.pravatar.cc/300?img=6'
          },
          {
            id: 7,
            name: 'Grace Lee',
            bio: 'Data Scientist with a focus on machine learning and AI. Turning data into actionable insights and building intelligent systems.',
            location: 'Chicago, IL',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas'],
            avatar: 'https://i.pravatar.cc/300?img=7'
          }
        ]
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
