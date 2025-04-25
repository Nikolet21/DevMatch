import type { ActivityAction, ActivityCategory, ActivityLog } from '@/types/activity';
import { actionCategoryMap } from '@/types/activity';
import { nanoid } from 'nanoid';

/**
 * Generates a human-readable description for activity logs
 */
export function generateActivityDescription(
  action: ActivityAction,
  metadata?: Record<string, any>
): string {
  switch (action) {
    case 'Login':
      return 'Successful login to account';
    case 'Logout':
      return 'Successfully logged out of account';
    case 'Password Changed':
      return 'Password was successfully updated';
    case 'Email Changed':
      return `Email address was updated${metadata?.newEmail ? ` to ${metadata.newEmail}` : ''}`;
    case 'MFA Enabled':
      return 'Two-factor authentication was enabled';
    case 'MFA Disabled':
      return 'Two-factor authentication was disabled';
    case 'Login Attempt Failed':
      return `Failed login attempt detected${metadata?.reason ? ` (${metadata.reason})` : ''}`;
    case 'Profile Updated':
      return 'Profile information was updated';
    case 'Profile Picture Updated':
      return 'Profile picture was changed';
    case 'Match Created':
      return `New match ${metadata?.userName ? `with developer ${metadata.userName}` : 'was created'}`;
    case 'Match Accepted':
      return `Match ${metadata?.userName ? `with ${metadata.userName}` : ''} was accepted`;
    case 'Match Rejected':
      return `Match ${metadata?.userName ? `with ${metadata.userName}` : ''} was rejected`;
    case 'Report Submitted':
      return `Report submitted ${metadata?.type ? `for ${metadata.type}` : ''}`;
    default:
      return 'Activity recorded';
  }
}

/**
 * Creates a new activity log entry
 */
export function createActivityLog(
  action: ActivityAction,
  metadata?: Record<string, any>
): ActivityLog {
  const category = actionCategoryMap[action];

  return {
    id: nanoid(),
    action,
    category,
    description: generateActivityDescription(action, metadata),
    timestamp: new Date(),
    metadata
  };
}

/**
 * Format an ISO date string to a localized date and time
 */
export function formatActivityDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Gets the appropriate icon name for the activity category
 */
export function getActivityIcon(category: ActivityCategory): string {
  switch (category) {
    case 'Security':
      return 'shield-alt';
    case 'Profile':
      return 'user-edit';
    case 'Matches':
      return 'user-check';
    case 'Reports':
      return 'flag';
    default:
      return 'info-circle';
  }
}

/**
 * Gets the appropriate color class for the activity category
 */
export function getActivityColor(category: ActivityCategory): string {
  switch (category) {
    case 'Security':
      return 'text-blue-500';
    case 'Profile':
      return 'text-purple-500';
    case 'Matches':
      return 'text-green-500';
    case 'Reports':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
}
