// Đổi sang string thay vì phụ thuộc vào const
export type DomainType = string;

export type ActionType = string;

export const DOMAINS = {
  ARTICLE: {
    value: 'article',
    actions: {
      VIEW: 'view',
      CREATE: 'create',
      EDIT_OWN: 'edit_own',
      EDIT_ALL: 'edit_all',
      DELETE_OWN: 'delete_own',
      DELETE_ALL: 'delete_all',
      PUBLISH: 'publish',
      UNPUBLISH: 'unpublish',
      REVIEW: 'review',
      MODERATE: 'moderate',
      ARCHIVE: 'archive',
      FEATURE: 'feature',
      PIN: 'pin',
      SCHEDULE: 'schedule'
    }
  },
  COMMENT: {
    value: 'comment',
    actions: {
      VIEW: 'view',
      CREATE: 'create',
      EDIT_OWN: 'edit_own',
      DELETE_OWN: 'delete_own',
      DELETE_ALL: 'delete_all',
      MODERATE: 'moderate',
      REPORT: 'report',
      REPLY: 'reply',
      LIKE: 'like'
    }
  },
  USER: {
    value: 'user',
    actions: {
      VIEW_ALL: 'view_all',
      VIEW_PROFILE: 'view_profile',
      EDIT_PROFILE: 'edit_profile',
      ASSIGN_ROLE: 'assign_role',
      CREATE: 'create',
      DELETE: 'delete',
      BLOCK: 'block',
      RESET_PASSWORD: 'reset_password',
      VERIFY: 'verify'
    }
  },
  ROLE: {
    value: 'role',
    actions: {
      VIEW: 'view',
      CREATE: 'create',
      EDIT: 'edit',
      DELETE: 'delete',
      ASSIGN_PERMISSION: 'assign_permission'
    }
  },
  CATEGORY: {
    value: 'category',
    actions: {
      VIEW: 'view',
      CREATE: 'create',
      EDIT: 'edit',
      DELETE: 'delete',
      MANAGE: 'manage'
    }
  },
  TAG: {
    value: 'tag',
    actions: {
      VIEW: 'view',
      CREATE: 'create',
      EDIT: 'edit',
      DELETE: 'delete',
      MANAGE: 'manage'
    }
  },
  MEDIA: {
    value: 'media',
    actions: {
      VIEW: 'view',
      UPLOAD: 'upload',
      DELETE: 'delete',
      EDIT: 'edit',
      DOWNLOAD: 'download',
      SHARE: 'share'
    }
  },
  SETTINGS: {
    value: 'settings',
    actions: {
      GENERAL: 'general',
      SEO: 'seo',
      EMAIL: 'email',
      SECURITY: 'security',
      PAYMENT: 'payment'
    }
  },
  REPORT: {
    value: 'report',
    actions: {
      VIEW_TRAFFIC: 'view_traffic',
      VIEW_CONTENT: 'view_content'
    }
  },
  ANALYTICS: {
    value: 'analytics',
    actions: {
      ACCESS: 'access'
    }
  }
};

function generateAllPermissions() {
  return Object.values(DOMAINS).map(domainObj => ({
    domain: domainObj.value,
    actions: Object.values(domainObj.actions)
  }));
}

export const ALL_PERMISSIONS = generateAllPermissions();
