import { defineStore } from 'pinia';
import type { ActivityLog, ActivityAction, ActivityCategory } from '@/interfaces/interfaces';
import { activityService } from '@/services/activityService';

interface ActivityStoreState {
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  currentFilter: {
    category: 'All' | ActivityCategory;
    searchQuery: string;
  };
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
}

export const useActivityStore = defineStore('activity', {
  state: (): ActivityStoreState => ({
    activityLogs: [],
    isLoading: false,
    error: null,
    currentFilter: {
      category: 'All',
      searchQuery: '',
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 5,
    },
  }),

  getters: {
    /**
     * Get all available categories for filtering
     */
    availableCategories: (state): ('All' | ActivityCategory)[] => {
      const categories = new Set<ActivityCategory>();

      state.activityLogs.forEach(log => {
        categories.add(log.category);
      });

      return ['All', ...Array.from(categories)];
    },

    /**
     * Get filtered activity logs
     */
    filteredActivityLogs: (state): ActivityLog[] => {
      return state.activityLogs.filter(activity => {
        // Apply category filter
        if (state.currentFilter.category !== 'All' && activity.category !== state.currentFilter.category) {
          return false;
        }

        // Apply search filter
        if (state.currentFilter.searchQuery) {
          const query = state.currentFilter.searchQuery.toLowerCase();
          return (
            activity.action.toLowerCase().includes(query) ||
            activity.description.toLowerCase().includes(query)
          );
        }

        return true;
      });
    },

    /**
     * Get paginated activity logs
     */
    paginatedActivityLogs(state): ActivityLog[] {
      const { filteredActivityLogs } = this;
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage;
      const endIndex = startIndex + state.pagination.itemsPerPage;

      return filteredActivityLogs.slice(startIndex, endIndex);
    },

    /**
     * Get total number of pages based on filtered logs and page size
     */
    totalPages(state): number {
      return Math.ceil(this.filteredActivityLogs.length / state.pagination.itemsPerPage);
    },
  },

  actions: {
    /**
     * Load activity logs from storage
     */
    async loadActivityLogs() {
      this.isLoading = true;
      this.error = null;

      try {
        const logs = activityService.getActivityLogs();
        this.activityLogs = logs.sort((a, b) =>
          b.timestamp.getTime() - a.timestamp.getTime()
        );
      } catch (error) {
        console.error('Error loading activity logs:', error);
        this.error = 'Failed to load activity logs';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Log a new activity
     */
    logActivity(action: ActivityAction, metadata?: Record<string, any>) {
      this.error = null;

      try {
        const newLog = activityService.logActivity(action, metadata);
        this.activityLogs = [newLog, ...this.activityLogs];
        return newLog;
      } catch (error) {
        console.error('Error logging activity:', error);
        this.error = 'Failed to log activity';
        throw error;
      }
    },

    /**
     * Clear all activity logs
     */
    clearAllLogs() {
      try {
        activityService.clearActivityLogs();
        this.activityLogs = [];
      } catch (error) {
        console.error('Error clearing activity logs:', error);
        this.error = 'Failed to clear activity logs';
      }
    },

    /**
     * Update filter settings
     */
    updateFilter(category: 'All' | ActivityCategory, searchQuery: string) {
      this.currentFilter.category = category;
      this.currentFilter.searchQuery = searchQuery;
      // Reset to first page when filter changes
      this.pagination.currentPage = 1;
    },

    /**
     * Go to a specific page
     */
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.pagination.currentPage = page;
      }
    },

    /**
     * Go to the previous page
     */
    previousPage() {
      if (this.pagination.currentPage > 1) {
        this.pagination.currentPage--;
      }
    },

    /**
     * Go to the next page
     */
    nextPage() {
      if (this.pagination.currentPage < this.totalPages) {
        this.pagination.currentPage++;
      }
    },

    /**
     * Set items per page
     */
    setItemsPerPage(count: number) {
      this.pagination.itemsPerPage = count;
      // Reset to first page when changing items per page
      this.pagination.currentPage = 1;
    },
  },
});
