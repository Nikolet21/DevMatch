import { defineStore } from 'pinia'
import type { Developer, Match, MatchState } from '../interfaces/interfaces'
import { mockDevelopers, mockMatches } from '../data/mockData'
import { useChatStore } from './chatStore'
import { useNotificationStore } from './notificationStore'
import { useActivityLogger } from '@/composables/useActivityLogger'
import { useSwipeStore } from './swipeStore'
import { useUserStore } from './userStore'

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
    async persistSwipedDevelopers(developerId: number) {
      try {
        // Get existing swipes from localStorage
        const swipedDevelopers = JSON.parse(localStorage.getItem('swipedDevelopers') || '[]');

        // Add this developer if not already in the list
        if (!swipedDevelopers.includes(developerId)) {
          swipedDevelopers.push(developerId);
          localStorage.setItem('swipedDevelopers', JSON.stringify(swipedDevelopers));
          console.log('Saved swiped developer:', developerId);
        }
      } catch (error) {
        console.error('Failed to persist swiped developer:', error);
      }
    },

    getPersistedSwipedDevelopers() {
      try {
        return JSON.parse(localStorage.getItem('swipedDevelopers') || '[]');
      } catch (error) {
        console.error('Failed to get persisted swiped developers:', error);
        return [];
      }
    },

    async fetchPotentialMatches() {
      this.isLoading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const swipeStore = useSwipeStore()

        console.log('Fetching potential matches for user:', userStore.user?.id);

        // Get IDs of users already swiped
        let swipedUserIds: string[] = [];
        if (userStore.user && userStore.user.id) {
          swipedUserIds = swipeStore.getSwipedUsers(userStore.user.id);
        }

        // Get persisted swiped developers from localStorage
        const persistedSwipedDevelopers = this.getPersistedSwipedDevelopers();
        console.log('Persisted swiped developers:', persistedSwipedDevelopers);

        // Filter out developers that have already been swiped
        const processedDeveloperIds = this.matches.map(match => match.developer.id)
        const availableDevelopers = mockDevelopers.filter(dev =>
          !processedDeveloperIds.includes(dev.id) &&
          !this.potentialMatches.some(match => match.id === dev.id) &&
          !swipedUserIds.includes(dev.id.toString()) &&
          !persistedSwipedDevelopers.includes(dev.id)
        )

        console.log(`Found ${availableDevelopers.length} available developers after filtering`);

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

        // Persist this swipe to localStorage
        await this.persistSwipedDevelopers(developerId);

        // Check if there's a pending match from the other developer
        const existingMatch = this.matches.find(
          m => m.developer.id === developer.id && m.status === 'pending'
        )

        const notificationStore = useNotificationStore()
        const { logMatchCreated, logMatchAccepted } = useActivityLogger()

        if (existingMatch) {
          // If there's a pending match, it means mutual like - auto accept
          await this.updateMatchStatus(existingMatch.id, 'accepted')

          // Log match acceptance
          logMatchAccepted(developer.name, developer.id.toString())

          // Notification handled in updateMatchStatus
        } else {
          // Create new pending match
          const newMatch: Match = {
            id: Date.now(),
            developer: developer,
            status: 'pending',
            matchedAt: new Date()
          }
          this.matches.push(newMatch)
          this.stats.likesSent++

          // Log that interest was shown (potential match)
          logMatchCreated(developer.name, developer.id.toString())

          // Add notification for potential match
          notificationStore.info(
            'Interest Sent',
            `You showed interest in connecting with ${developer.name}. We'll notify you if they connect back!`,
            '/home/matches'
          )

          // Special case for David Kim (ID: 4) - simulate immediate match
          if (developer.id === 4) {
            console.log("Special case: David Kim match simulation");

            // Clear any existing notifications to show this one immediately
            notificationStore.hideToast();
            notificationStore.notificationQueue = [];

            // Create a match notification that stays longer
            notificationStore.success(
              'New Match!',
              `You matched with David Kim! Check your matches to start a conversation.`,
              '/home/matches',
              5000 // Shorter duration for faster flow
            );

            // Add to database matches
            const swipeStore = useSwipeStore();
            const userStore = useUserStore();
            if (userStore.user && userStore.user.id) {
              swipeStore.addMatch({
                userAId: userStore.user.id,
                userBId: "4"
              });
            }

            // Update this match to accepted
            this.updateMatchStatus(newMatch.id, 'accepted');

            // Refresh matches
            this.fetchMatches();
          }
        }

        this.moveToNextDeveloper()
      } catch (error) {
        this.error = 'Failed to like developer'
        console.error(error)

        // Add error notification
        const notificationStore = useNotificationStore()
        notificationStore.error(
          'Connection Failed',
          'Failed to express interest in connecting. Please try again later.'
        )
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

        // Log match rejection
        const { logMatchRejected } = useActivityLogger()
        logMatchRejected(developer.name, developer.id.toString())

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
        // Get matches from swipeStore
        const userStore = useUserStore()
        const swipeStore = useSwipeStore()

        console.log('Fetching matches for user:', userStore.user?.id)

        if (userStore.user && userStore.user.id) {
          const dbMatches = swipeStore.getMatches(userStore.user.id)
          console.log('DB Matches from swipe store:', dbMatches)

          // For each match, find the corresponding developer
          const matchPromises = dbMatches.map(dbMatch => {
            // Determine which user ID is the other user (not current user)
            const otherUserId = dbMatch.userAId === userStore.user?.id
              ? dbMatch.userBId
              : dbMatch.userAId

            console.log(`Processing DB match: ${dbMatch.id}, otherUserId: ${otherUserId}`)

            // Find the developer with this ID
            const developerId = parseInt(otherUserId)
            const developer = mockDevelopers.find(dev => dev.id === developerId) || {
              id: developerId,
              name: 'Unknown Developer',
              email: '',
              avatar: '/default-avatar.png',
              location: 'Unknown Location',
              skills: [],
              bio: 'No bio available'
            }

            // Create a UI match from this data
            return {
              id: parseInt(dbMatch.id),
              developer,
              matchedAt: dbMatch.createdAt,
              status: dbMatch.isConnected ? 'accepted' as const : 'pending' as const
            }
          })

          // Clear previous matches and only use DB matches
          this.matches = matchPromises
          this.stats.totalMatches = this.matches.filter(m => m.status === 'accepted').length
        } else {
          // Fallback to mock data if user is not available
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
        }
      } catch (error) {
        this.error = 'Failed to fetch matches'
        console.error('Error fetching matches:', error)
      } finally {
        this.isLoading = false
      }
    },

    async updateMatchStatus(matchId: number, status: 'accepted' | 'rejected') {
      try {
        console.log(`Updating match ${matchId} status to ${status}`);

        // Find the match in our local state
        const match = this.matches.find(m => m.id === matchId);
        console.log('Found match:', match);

        if (match) {
          // Update the status in our local state
          match.status = status;
          console.log(`Updated match status to ${status}`);

          const { logMatchAccepted, logMatchRejected } = useActivityLogger();

          if (status === 'accepted') {
            this.stats.totalMatches++;
            console.log('Incremented total matches count');

            // Log match acceptance
            logMatchAccepted(match.developer.name, match.developer.id.toString());

            // Initialize chat when match is accepted
            const chatStore = useChatStore();
            await chatStore.initializeChat(match.developer.id.toString());
            console.log('Initialized chat');

            // Create a corresponding DbMatch in the swipeStore or update existing
            const userStore = useUserStore();
            const swipeStore = useSwipeStore();

            if (userStore.user && userStore.user.id) {
              console.log(`Looking for existing DB match between ${userStore.user.id} and ${match.developer.id}`);

              // Find the match in swipeStore to update isConnected flag
              const existingDbMatch = swipeStore.matches.find(
                m => (m.userAId === userStore.user?.id && m.userBId === match.developer.id.toString()) ||
                     (m.userBId === userStore.user?.id && m.userAId === match.developer.id.toString())
              );

              if (existingDbMatch) {
                // Update the existing match
                console.log('Found existing DB match, updating isConnected flag');
                existingDbMatch.isConnected = true;
              } else {
                // Create a new match if none exists
                console.log('No existing DB match found, creating new one with isConnected=true');
                await swipeStore.addMatch({
                  userAId: userStore.user.id,
                  userBId: match.developer.id.toString(),
                  isConnected: true
                });
              }

              // Force refresh UI
              await this.fetchMatches();
              console.log('Refreshed matches after connection');
            }
          } else if (status === 'rejected') {
            // Log match rejection
            logMatchRejected(match.developer.name, match.developer.id.toString());
          }

          return true;
        } else {
          console.error(`Match with ID ${matchId} not found`);
          return false;
        }
      } catch (error) {
        const notificationStore = useNotificationStore();
        notificationStore.error(
          'Connection Update Failed',
          'Failed to update connection status. Please try again later.'
        );

        this.error = 'Failed to update match status';
        console.error('Error in updateMatchStatus:', error);
        return false;
      }
    }
  }
})
