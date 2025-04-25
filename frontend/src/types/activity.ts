export type ActivityCategory = 'Security' | 'Profile' | 'Matches' | 'Reports' | 'Privacy';

export type ActivityAction =
  // Security actions
  | 'Login'
  | 'Logout'
  | 'Password Changed'
  | 'Email Changed'
  | 'MFA Enabled'
  | 'MFA Disabled'
  | 'Login Attempt Failed'
  | 'Account Deleted'
  // Profile actions
  | 'Profile Updated'
  | 'Profile Picture Updated'
  // Match actions
  | 'Match Created'
  | 'Match Accepted'
  | 'Match Rejected'
  // Report actions
  | 'Report Submitted'
  // Privacy actions
  | 'User Muted'
  | 'User Unmuted'
  | 'User Blocked'
  | 'User Unblocked';

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  category: ActivityCategory;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>; // Optional additional data
}

// This maps action types to their categories for consistency
export const actionCategoryMap: Record<ActivityAction, ActivityCategory> = {
  // Security actions
  'Login': 'Security',
  'Logout': 'Security',
  'Password Changed': 'Security',
  'Email Changed': 'Security',
  'MFA Enabled': 'Security',
  'MFA Disabled': 'Security',
  'Login Attempt Failed': 'Security',
  'Account Deleted': 'Security',
  // Profile actions
  'Profile Updated': 'Profile',
  'Profile Picture Updated': 'Profile',
  // Match actions
  'Match Created': 'Matches',
  'Match Accepted': 'Matches',
  'Match Rejected': 'Matches',
  // Report actions
  'Report Submitted': 'Reports',
  // Privacy actions
  'User Muted': 'Privacy',
  'User Unmuted': 'Privacy',
  'User Blocked': 'Privacy',
  'User Unblocked': 'Privacy'
};
