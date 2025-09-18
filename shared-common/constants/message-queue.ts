// Service Names
export const SERVICE_NAMES = {
  MAIN_SERVICE: 'MAIN_SERVICE',
  AUTH_SERVICE: 'AUTH_SERVICE',
  MEDIAS_SERVICE: 'MEDIAS_SERVICE',
  USER_PERMISSION_GATEWAY: 'USER_PERMISSION_GATEWAY',
} as const;

// Queue Names
export const QUEUE_NAMES = {
  MAIN_SERVICE_QUEUE: 'main_service_queue',
  AUTH_SERVICE_QUEUE: 'auth_service_queue',
  MEDIAS_SERVICE_QUEUE: 'medias_service_queue',
  USER_PERMISSION_GATEWAY_QUEUE: 'user_permission_gateway_queue',
} as const;

// Legacy export for backward compatibility
export const MESSAGE_QUEUE = {
  MAIN_SERVICE: SERVICE_NAMES.MAIN_SERVICE,
};