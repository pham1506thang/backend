// Message patterns for microservices communication
export const USER_MESSAGE_PATTERNS = {
  // User operations
  FIND_BY_USERNAME: 'user.findByUsername',
  FIND_BY_ID: 'user.findById',
  FIND_BY_ID_WITH_PERMISSIONS: 'user.findByIdWithPermissions',
  INVALIDATE_PERMISSION_CACHE: 'user.invalidatePermissionCache',
  CREATE: 'user.create',
  UPDATE: 'user.update',
  DELETE: 'user.delete',
  UPDATE_LAST_LOGIN: 'user.updateLastLogin',
  CHANGE_PASSWORD: 'user.changePassword',
  USER_ROLE_ASSIGNED: 'user.roleAssigned',
  USER_ROLE_REMOVED: 'user.roleRemoved',
} as const;

export const PERMISSION_CHECK_MESSAGE_PATTERNS = {
  FIND_BY_ID_WITH_PERMISSIONS: 'permission-check.findByIdWithPermissions',
  INVALIDATE_PERMISSION_CACHE: 'permission-check.invalidatePermissionCache',
} as const;

export const AUTH_MESSAGE_PATTERNS = {
  // Auth operations
  VALIDATE_USER: 'auth.validateUser',
  LOGIN: 'auth.login',
  REFRESH_TOKEN: 'auth.refreshToken',
  LOGOUT: 'auth.logout',
} as const;
