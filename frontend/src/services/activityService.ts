import type { ActivityLog, ActivityAction } from '@/types/activity';
import { createActivityLog } from '@/utils/activityUtils';

const STORAGE_KEY = 'devmatch_activity_logs';
const MAX_LOGS = 100; // Maximum number of logs to store locally

/**
 * Service to manage activity logs in local storage
 * In a real app, this would interact with a backend API
 */
export const activityService = {
  /**
   * Get all activity logs from local storage
   */
  getActivityLogs(): ActivityLog[] {
    try {
      const storedLogs = localStorage.getItem(STORAGE_KEY);
      if (!storedLogs) return [];

      const parsedLogs = JSON.parse(storedLogs) as Array<any>;

      // Convert ISO strings back to Date objects
      return parsedLogs.map(log => ({
        ...log,
        timestamp: new Date(log.timestamp)
      }));
    } catch (error) {
      console.error('Error retrieving activity logs:', error);
      return [];
    }
  },

  /**
   * Save logs to local storage
   */
  saveLogs(logs: ActivityLog[]): void {
    try {
      // Limit the number of logs we store
      const limitedLogs = logs.slice(0, MAX_LOGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedLogs));
    } catch (error) {
      console.error('Error saving activity logs:', error);
    }
  },

  /**
   * Add a new activity log
   */
  logActivity(action: ActivityAction, metadata?: Record<string, any>): ActivityLog {
    try {
      const newLog = createActivityLog(action, metadata);

      const currentLogs = this.getActivityLogs();
      const updatedLogs = [newLog, ...currentLogs];

      this.saveLogs(updatedLogs);
      return newLog;
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  },

  /**
   * Clear all activity logs
   */
  clearActivityLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing activity logs:', error);
    }
  }
};
