import { defineStore } from 'pinia';
import type { Swipe, DbMatch } from '@/interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { useMatchStore } from './matchStore';
import { useNotificationStore } from './notificationStore';
import { useActivityLogger } from '@/composables/useActivityLogger';
import { mockSwipes, mockDbMatches } from '@/data/mockData';
import { useUserStore } from './userStore';

export interface SwipeState {
  swipes: Swipe[];
  matches: DbMatch[];
}

export const useSwipeStore = defineStore('swipe', {
  state: (): SwipeState => ({
    swipes: [...mockSwipes],
    matches: [...mockDbMatches]
  }),

  getters: {
    getSwipedUsers: (state) => {
      return (userId: string): string[] => {
        return state.swipes
          .filter(swipe => swipe.swiperId === userId)
          .map(swipe => swipe.swipedId);
      };
    },

    getMatches: (state) => {
      return (userId: string): DbMatch[] => {
        console.log(`Getting matches for user ${userId}, total matches: ${state.matches.length}`);
        const matches = state.matches.filter(
          match => match.userAId === userId || match.userBId === userId
        );
        console.log(`Found ${matches.length} matches for user ${userId}:`, matches);
        return matches;
      };
    }
  },

  actions: {
    async addSwipe(swipe: Omit<Swipe, 'id' | 'createdAt'>) {
      const newSwipe: Swipe = {
        ...swipe,
        id: uuidv4(),
        createdAt: new Date()
      };
      this.swipes.push(newSwipe);

      console.log(`Added new swipe: ${swipe.swiperId} → ${swipe.swipedId} (liked: ${swipe.isLiked})`);

      // Get user and developer info for better notifications
      const userStore = useUserStore();
      const notificationStore = useNotificationStore();

      // Add special case for David Kim (id: 4)
      if (swipe.swipedId === "4" && swipe.isLiked) {
        console.log("Special David Kim swipe detected, creating immediate match");

        // Create a match directly
        this.addMatch({
          userAId: swipe.swiperId,
          userBId: swipe.swipedId
        });

        // Send notification about the new match immediately
        // Clear any existing notifications to show this one immediately
        notificationStore.hideToast();
        notificationStore.notificationQueue = [];

        notificationStore.success(
          'New Match!',
          `You matched with David Kim! Check your matches to start a conversation.`,
          '/home/matches',
          5000 // Shorter duration for faster flow
        );

        return true;
      }

      // Check for mutual likes
      const mutualLike = this.swipes.find(
        s => s.swiperId === swipe.swipedId &&
             s.swipedId === swipe.swiperId &&
             s.isLiked === true &&
             swipe.isLiked === true
      );

      if (mutualLike) {
        console.log('Found mutual like between', swipe.swiperId, 'and', swipe.swipedId);

        // Find developer name for better notification
        const matchStore = useMatchStore();
        const developerId = parseInt(swipe.swipedId);
        const developer = matchStore.potentialMatches.find(dev => dev.id === developerId);
        const developerName = developer?.name || 'a developer';

        // Create a match
        this.addMatch({
          userAId: swipe.swiperId,
          userBId: swipe.swipedId
        });

        // Send immediate notification about the mutual match with high priority
        // Clear any existing notifications in queue to show this one immediately
        notificationStore.hideToast();
        notificationStore.notificationQueue = [];

        // Add the match notification with high priority
        notificationStore.success(
          '🎉 New Match!',
          `You and ${developerName} have matched! Check your matches section to start a conversation.`,
          '/home/matches',
          5000 // Shorter duration for faster flow
        );

        return true;
      } else if (swipe.isLiked) {
        // Show interest notification
        notificationStore.info(
          'Interest Sent',
          `You showed interest in connecting. We'll notify you if they connect back!`,
          '/home/matches',
          5000
        );
      }

      return false;
    },

    async addMatch(match: Omit<DbMatch, 'id' | 'createdAt'>) {
      console.log(`Adding new match between ${match.userAId} and ${match.userBId}`);

      // Check if match already exists to prevent duplicates
      const existingMatch = this.matches.find(
        m => (m.userAId === match.userAId && m.userBId === match.userBId) ||
             (m.userAId === match.userBId && m.userBId === match.userAId)
      );

      if (existingMatch) {
        console.log('Match already exists, not adding duplicate');
        // Update isConnected status if provided
        if (match.isConnected) {
          existingMatch.isConnected = true;
          console.log('Updated existing match isConnected status to true');
        }
        return existingMatch;
      }

      const newMatch: DbMatch = {
        ...match,
        id: uuidv4(),
        createdAt: new Date(),
        isConnected: match.isConnected || false
      };
      this.matches.push(newMatch);
      console.log('Match added, updated matches:', this.matches);

      // Update match stats in matchStore
      const matchStore = useMatchStore();
      if (matchStore.stats) {
        matchStore.stats.totalMatches++;
      }

      return newMatch;
    }
  }
});
