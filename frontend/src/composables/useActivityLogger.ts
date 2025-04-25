import { useActivityStore } from '@/stores/activityStore';
import type { ActivityAction } from '@/types/activity';

/**
 * Composable for logging user activities from any component
 */
export function useActivityLogger() {
  const activityStore = useActivityStore();

  /**
   * Log a user login event
   */
  const logLogin = (metadata?: Record<string, any>) => {
    activityStore.logActivity('Login', metadata);
  };

  /**
   * Log a user logout event
   */
  const logLogout = (metadata?: Record<string, any>) => {
    activityStore.logActivity('Logout', metadata);
  };

  /**
   * Log a failed login attempt
   */
  const logLoginFailed = (reason?: string) => {
    activityStore.logActivity('Login Attempt Failed', { reason });
  };

  /**
   * Log a password change event
   */
  const logPasswordChanged = (metadata?: Record<string, any>) => {
    activityStore.logActivity('Password Changed', metadata);
  };

  /**
   * Log an email change event
   */
  const logEmailChanged = (newEmail?: string, metadata?: Record<string, any>) => {
    activityStore.logActivity('Email Changed', { newEmail, ...metadata });
  };

  /**
   * Log an MFA enabled event
   */
  const logMfaEnabled = (metadata?: Record<string, any>) => {
    activityStore.logActivity('MFA Enabled', metadata);
  };

  /**
   * Log an MFA disabled event
   */
  const logMfaDisabled = (metadata?: Record<string, any>) => {
    activityStore.logActivity('MFA Disabled', metadata);
  };

  /**
   * Log a profile update event
   */
  const logProfileUpdated = (fields?: string[]) => {
    activityStore.logActivity('Profile Updated', { fields });
  };

  /**
   * Log a profile picture update event
   */
  const logProfilePictureUpdated = () => {
    activityStore.logActivity('Profile Picture Updated');
  };

  /**
   * Log a match creation event
   */
  const logMatchCreated = (userName: string, userId?: string) => {
    activityStore.logActivity('Match Created', { userName, userId });
  };

  /**
   * Log a match acceptance event
   */
  const logMatchAccepted = (userName: string, userId?: string) => {
    activityStore.logActivity('Match Accepted', { userName, userId });
  };

  /**
   * Log a match rejection event
   */
  const logMatchRejected = (userName: string, userId?: string) => {
    activityStore.logActivity('Match Rejected', { userName, userId });
  };

  /**
   * Log a report submission event
   */
  const logReportSubmitted = (type: string, targetId?: string) => {
    activityStore.logActivity('Report Submitted', { type, targetId });
  };

  /**
   * Log a user muted event
   */
  const logUserMuted = (userName: string, userId?: string) => {
    activityStore.logActivity('User Muted', { userName, userId });
  };

  /**
   * Log a user unmuted event
   */
  const logUserUnmuted = (userName: string, userId?: string) => {
    activityStore.logActivity('User Unmuted', { userName, userId });
  };

  /**
   * Log a user blocked event
   */
  const logUserBlocked = (userName: string, userId?: string) => {
    activityStore.logActivity('User Blocked', { userName, userId });
  };

  /**
   * Log a user unblocked event
   */
  const logUserUnblocked = (userName: string, userId?: string) => {
    activityStore.logActivity('User Unblocked', { userName, userId });
  };

  /**
   * Generic method to log any activity
   */
  const logActivity = (action: ActivityAction, metadata?: Record<string, any>) => {
    activityStore.logActivity(action, metadata);
  };

  return {
    logLogin,
    logLogout,
    logLoginFailed,
    logPasswordChanged,
    logEmailChanged,
    logMfaEnabled,
    logMfaDisabled,
    logProfileUpdated,
    logProfilePictureUpdated,
    logMatchCreated,
    logMatchAccepted,
    logMatchRejected,
    logReportSubmitted,
    logUserMuted,
    logUserUnmuted,
    logUserBlocked,
    logUserUnblocked,
    logActivity
  };
}
