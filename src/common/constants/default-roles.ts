import { DOMAINS } from './permissions';

export const DEFAULT_ROLES = [
  {
    code: 'reader',
    label: 'Độc giả',
    description:
      'Người dùng có thể đọc bài viết, tạo bình luận và quản lý thông tin cá nhân',
    permissions: [
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.CREATE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.REPORT,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.VIEW,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.EDIT,
      },
    ],
  },
  {
    code: 'reporter',
    label: 'Phóng viên',
    description:
      'Có thể tạo, chỉnh sửa và xóa bài viết của mình, quản lý media và bình luận',
    permissions: [
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.CREATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.EDIT_OWN,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.DELETE_OWN,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.DUPLICATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.VIEW_ANALYTICS,
      },
      { domain: DOMAINS.COMMENTS.value, action: DOMAINS.COMMENTS.actions.VIEW },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.CREATE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.REPORT,
      },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.VIEW },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.UPLOAD },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.EDIT },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.DOWNLOAD },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.EMBED,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.MANAGE_GALLERIES,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.VIEW,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.APPLY,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.VIEW,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.EDIT,
      },
    ],
  },
  {
    code: 'editor',
    label: 'Biên tập viên',
    description:
      'Có toàn quyền quản lý nội dung, bao gồm xuất bản, kiểm duyệt và quản lý tất cả bài viết',
    permissions: [
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.CREATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.EDIT_ALL,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.DELETE_ALL,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.PUBLISH,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.UNPUBLISH,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.REVIEW,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.MODERATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.FEATURE,
      },
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.PIN },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.DUPLICATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.BULK_EDIT,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.BULK_DELETE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.VIEW_ANALYTICS,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.CREATE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.EDIT,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.PUBLISH,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.CREATE,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.EDIT,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.PUBLISH,
      },
      { domain: DOMAINS.WORKFLOW.value, action: DOMAINS.WORKFLOW.actions.VIEW },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.APPROVE,
      },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.REJECT,
      },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.ASSIGN,
      },
      { domain: DOMAINS.COMMENTS.value, action: DOMAINS.COMMENTS.actions.VIEW },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.MODERATE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.REPLY,
      },
      { domain: DOMAINS.COMMENTS.value, action: DOMAINS.COMMENTS.actions.LIKE },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.BULK_MODERATE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.BULK_DELETE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.APPROVE,
      },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.VIEW },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.UPLOAD },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.DELETE },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.EDIT },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.DOWNLOAD },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.SHARE },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.BULK_UPLOAD,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.BULK_DELETE,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.EMBED,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.CONVERT,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.OPTIMIZE,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.MANAGE_GALLERIES,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.VIEW,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.MANAGE,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.CREATE,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.EDIT,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.DELETE,
      },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.VIEW },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.MANAGE },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.CREATE },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.EDIT },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.DELETE },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.VIEW,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.CREATE,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.EDIT,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.APPLY,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.ACCESS,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_DETAILED,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_CONTENT_PERFORMANCE,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_CONTENT,
      },
      { domain: DOMAINS.REPORTS.value, action: DOMAINS.REPORTS.actions.EXPORT },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.EDIT,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.CREATE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.DELETE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.BLOCK },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.UNBLOCK },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.RESET_PASSWORD,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VERIFY },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.VIEW_ACTIVITY,
      },
    ],
  },
  {
    code: 'super_admin',
    label: 'Super Admin',
    description:
      'Có toàn quyền truy cập hệ thống, bao gồm tất cả quyền admin và quản lý cấu hình hệ thống',
    isAdmin: true,
    isSuperAdmin: true,
    permissions: [],
  },
  {
    code: 'admin',
    label: 'Admin',
    description: 'Có quyền quản trị hệ thống với các chức năng admin cơ bản',
    isAdmin: true,
    permissions: [
      // Articles - Full management
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.CREATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.EDIT_ALL,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.DELETE_ALL,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.PUBLISH,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.UNPUBLISH,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.REVIEW,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.MODERATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.FEATURE,
      },
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.PIN },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.DUPLICATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.BULK_EDIT,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.BULK_DELETE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.VIEW_ANALYTICS,
      },

      // Breaking News & Live Updates
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.CREATE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.EDIT,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.DELETE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.PUBLISH,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.PRIORITIZE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.NOTIFY,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.CREATE,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.EDIT,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.DELETE,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.PUBLISH,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.MODERATE,
      },

      // Workflow
      { domain: DOMAINS.WORKFLOW.value, action: DOMAINS.WORKFLOW.actions.VIEW },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.APPROVE,
      },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.REJECT,
      },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.ASSIGN,
      },
      {
        domain: DOMAINS.WORKFLOW.value,
        action: DOMAINS.WORKFLOW.actions.DELEGATE,
      },

      // Comments - Full management
      { domain: DOMAINS.COMMENTS.value, action: DOMAINS.COMMENTS.actions.VIEW },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.MODERATE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.REPLY,
      },
      { domain: DOMAINS.COMMENTS.value, action: DOMAINS.COMMENTS.actions.LIKE },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.BULK_MODERATE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.BULK_DELETE,
      },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.APPROVE,
      },
      { domain: DOMAINS.COMMENTS.value, action: DOMAINS.COMMENTS.actions.SPAM },
      {
        domain: DOMAINS.COMMENTS.value,
        action: DOMAINS.COMMENTS.actions.BAN_USER,
      },

      // Medias - Full management
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.VIEW },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.UPLOAD },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.DELETE },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.EDIT },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.DOWNLOAD },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.SHARE },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.BULK_UPLOAD,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.BULK_DELETE,
      },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.CONVERT },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.OPTIMIZE },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.WATERMARK,
      },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.EMBED },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.MANAGE_GALLERIES,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.MANAGE_FOLDERS,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.SET_PERMISSIONS,
      },

      // Categories & Tags - Full management
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.VIEW,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.CREATE,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.EDIT,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.DELETE,
      },
      {
        domain: DOMAINS.CATEGORIES.value,
        action: DOMAINS.CATEGORIES.actions.MANAGE,
      },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.VIEW },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.CREATE },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.EDIT },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.DELETE },
      { domain: DOMAINS.TAGS.value, action: DOMAINS.TAGS.actions.MANAGE },

      // Content Templates
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.VIEW,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.CREATE,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.EDIT,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.DELETE,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.SHARE,
      },
      {
        domain: DOMAINS.CONTENT_TEMPLATES.value,
        action: DOMAINS.CONTENT_TEMPLATES.actions.APPLY,
      },

      // Users - Full management (except Super Admin)
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.EDIT },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.CREATE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.DELETE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.BLOCK },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.UNBLOCK },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.ASSIGN_ROLE,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.CHANGE_PASSWORD,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.RESET_PASSWORD,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VERIFY },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.BULK_EDIT },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.BULK_DELETE,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.BULK_BLOCK },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.EXPORT },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.IMPORT },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.VIEW_ACTIVITY,
      },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.MANAGE_PREFERENCES,
      },

      // Roles - View and basic management (no Super Admin)
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.VIEW },
      {
        domain: DOMAINS.ROLES.value,
        action: DOMAINS.ROLES.actions.VIEW_SUMMARY,
      },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.CREATE },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.EDIT },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.DELETE },
      {
        domain: DOMAINS.ROLES.value,
        action: DOMAINS.ROLES.actions.ASSIGN_PERMISSION,
      },

      // Analytics & Reports - Full access
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.ACCESS,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_DETAILED,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.EXPORT_DATA,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_USER_BEHAVIOR,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_CONTENT_PERFORMANCE,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_TRAFFIC_SOURCES,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_ENGAGEMENT_METRICS,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_TRAFFIC,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_CONTENT,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_USER,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_FINANCIAL,
      },
      { domain: DOMAINS.REPORTS.value, action: DOMAINS.REPORTS.actions.EXPORT },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.CUSTOMIZE,
      },

      // Settings - Basic admin settings
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.GENERAL,
      },
      { domain: DOMAINS.SETTINGS.value, action: DOMAINS.SETTINGS.actions.SEO },
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.EMAIL,
      },
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.APPEARANCE,
      },
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.NOTIFICATIONS,
      },

      // Newsletters
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.VIEW,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.CREATE,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.EDIT,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.DELETE,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.SEND,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.MANAGE_SUBSCRIBERS,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.VIEW_STATS,
      },

      // Social Media
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.CONNECT,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.POST,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.MANAGE,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.VIEW_INSIGHTS,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.MODERATE,
      },

      // SEO
      { domain: DOMAINS.SEO.value, action: DOMAINS.SEO.actions.MANAGE_META },
      { domain: DOMAINS.SEO.value, action: DOMAINS.SEO.actions.MANAGE_SITEMAP },
      { domain: DOMAINS.SEO.value, action: DOMAINS.SEO.actions.MANAGE_ROBOTS },
      {
        domain: DOMAINS.SEO.value,
        action: DOMAINS.SEO.actions.ANALYZE_KEYWORDS,
      },
      {
        domain: DOMAINS.SEO.value,
        action: DOMAINS.SEO.actions.OPTIMIZE_CONTENT,
      },

      // Advertisements
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.VIEW,
      },
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.CREATE,
      },
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.EDIT,
      },
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.DELETE,
      },
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.PUBLISH,
      },
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.MANAGE_CAMPAIGNS,
      },
      {
        domain: DOMAINS.ADVERTISEMENTS.value,
        action: DOMAINS.ADVERTISEMENTS.actions.VIEW_ANALYTICS,
      },

      // Notifications
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.VIEW,
      },
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.CREATE,
      },
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.SEND,
      },
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.MANAGE_TEMPLATES,
      },
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.CONFIGURE,
      },
    ],
  },
  {
    code: 'user_manager',
    label: 'Quản lý người dùng',
    description:
      'Chuyên quản lý người dùng, bao gồm tạo, xóa, khóa tài khoản và phân quyền',
    permissions: [
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.EDIT,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.CREATE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.DELETE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.BLOCK },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.RESET_PASSWORD,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VERIFY },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.ASSIGN_ROLE,
      },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.VIEW },
    ],
  },
  {
    code: 'role_manager',
    label: 'Quản lý vai trò và phân quyền',
    description: 'Chuyên quản lý vai trò và phân quyền trong hệ thống',
    permissions: [
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.VIEW },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.CREATE },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.EDIT },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.DELETE },
      {
        domain: DOMAINS.ROLES.value,
        action: DOMAINS.ROLES.actions.ASSIGN_PERMISSION,
      },
    ],
  },
  {
    code: 'support_staff',
    label: 'Nhân viên hỗ trợ',
    description: 'Hỗ trợ người dùng với quyền xem thông tin và reset mật khẩu',
    permissions: [
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.RESET_PASSWORD,
      },
    ],
  },
  {
    code: 'auditor',
    label: 'Kiểm toán viên',
    description:
      'Có quyền xem thông tin người dùng và vai trò để thực hiện kiểm toán',
    permissions: [
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
      {
        domain: DOMAINS.USERS.value,
        action: DOMAINS.USERS.actions.VIEW_ACTIVITY,
      },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.VIEW },
      { domain: DOMAINS.LOGS.value, action: DOMAINS.LOGS.actions.VIEW },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_SYSTEM,
      },
    ],
  },
  {
    code: 'newsletter_manager',
    label: 'Quản lý Newsletter',
    description: 'Chuyên quản lý newsletter và email marketing',
    permissions: [
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.VIEW,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.CREATE,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.EDIT,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.DELETE,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.SEND,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.MANAGE_SUBSCRIBERS,
      },
      {
        domain: DOMAINS.NEWSLETTERS.value,
        action: DOMAINS.NEWSLETTERS.actions.VIEW_STATS,
      },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
    ],
  },
  {
    code: 'social_media_manager',
    label: 'Quản lý Mạng xã hội',
    description: 'Quản lý và đăng bài trên các nền tảng mạng xã hội',
    permissions: [
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.CONNECT,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.POST,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.SCHEDULE,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.MANAGE,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.VIEW_INSIGHTS,
      },
      {
        domain: DOMAINS.SOCIAL_MEDIA.value,
        action: DOMAINS.SOCIAL_MEDIA.actions.MODERATE,
      },
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.VIEW },
      { domain: DOMAINS.MEDIAS.value, action: DOMAINS.MEDIAS.actions.UPLOAD },
    ],
  },
  {
    code: 'seo_specialist',
    label: 'Chuyên gia SEO',
    description: 'Tối ưu hóa SEO và quản lý từ khóa',
    permissions: [
      { domain: DOMAINS.SEO.value, action: DOMAINS.SEO.actions.MANAGE_META },
      { domain: DOMAINS.SEO.value, action: DOMAINS.SEO.actions.MANAGE_SITEMAP },
      { domain: DOMAINS.SEO.value, action: DOMAINS.SEO.actions.MANAGE_ROBOTS },
      {
        domain: DOMAINS.SEO.value,
        action: DOMAINS.SEO.actions.ANALYZE_KEYWORDS,
      },
      {
        domain: DOMAINS.SEO.value,
        action: DOMAINS.SEO.actions.OPTIMIZE_CONTENT,
      },
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.EDIT_ALL,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.ACCESS,
      },
      {
        domain: DOMAINS.ANALYTICS.value,
        action: DOMAINS.ANALYTICS.actions.VIEW_TRAFFIC_SOURCES,
      },
      {
        domain: DOMAINS.REPORTS.value,
        action: DOMAINS.REPORTS.actions.VIEW_TRAFFIC,
      },
    ],
  },
  {
    code: 'multimedia_editor',
    label: 'Biên tập viên Multimedia',
    description: 'Chuyên xử lý và quản lý nội dung multimedia',
    permissions: [
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.VIEW,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.UPLOAD,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.EDIT,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.DELETE,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.CONVERT,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.OPTIMIZE,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.EMBED,
      },
      {
        domain: DOMAINS.MEDIAS.value,
        action: DOMAINS.MEDIAS.actions.MANAGE_GALLERIES,
      },
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
    ],
  },
  {
    code: 'breaking_news_editor',
    label: 'Biên tập viên Tin nóng',
    description: 'Chuyên xử lý tin tức khẩn cấp và cập nhật trực tiếp',
    permissions: [
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.CREATE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.EDIT,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.DELETE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.PUBLISH,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.PRIORITIZE,
      },
      {
        domain: DOMAINS.BREAKING_NEWS.value,
        action: DOMAINS.BREAKING_NEWS.actions.NOTIFY,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.CREATE,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.EDIT,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.PUBLISH,
      },
      {
        domain: DOMAINS.LIVE_UPDATES.value,
        action: DOMAINS.LIVE_UPDATES.actions.MODERATE,
      },
      { domain: DOMAINS.ARTICLES.value, action: DOMAINS.ARTICLES.actions.VIEW },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.CREATE,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.EDIT_ALL,
      },
      {
        domain: DOMAINS.ARTICLES.value,
        action: DOMAINS.ARTICLES.actions.PUBLISH,
      },
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.CREATE,
      },
      {
        domain: DOMAINS.NOTIFICATIONS.value,
        action: DOMAINS.NOTIFICATIONS.actions.SEND,
      },
    ],
  },
  {
    code: 'system_administrator',
    label: 'Quản trị viên Hệ thống',
    description: 'Quản lý cấu hình hệ thống, backup và tích hợp',
    permissions: [
      { domain: DOMAINS.BACKUPS.value, action: DOMAINS.BACKUPS.actions.CREATE },
      {
        domain: DOMAINS.BACKUPS.value,
        action: DOMAINS.BACKUPS.actions.RESTORE,
      },
      { domain: DOMAINS.BACKUPS.value, action: DOMAINS.BACKUPS.actions.DELETE },
      {
        domain: DOMAINS.BACKUPS.value,
        action: DOMAINS.BACKUPS.actions.DOWNLOAD,
      },
      {
        domain: DOMAINS.BACKUPS.value,
        action: DOMAINS.BACKUPS.actions.SCHEDULE,
      },
      { domain: DOMAINS.LOGS.value, action: DOMAINS.LOGS.actions.VIEW },
      { domain: DOMAINS.LOGS.value, action: DOMAINS.LOGS.actions.EXPORT },
      { domain: DOMAINS.LOGS.value, action: DOMAINS.LOGS.actions.DELETE },
      { domain: DOMAINS.LOGS.value, action: DOMAINS.LOGS.actions.MONITOR },
      {
        domain: DOMAINS.INTEGRATIONS.value,
        action: DOMAINS.INTEGRATIONS.actions.MANAGE,
      },
      {
        domain: DOMAINS.INTEGRATIONS.value,
        action: DOMAINS.INTEGRATIONS.actions.CONFIGURE,
      },
      {
        domain: DOMAINS.INTEGRATIONS.value,
        action: DOMAINS.INTEGRATIONS.actions.TEST,
      },
      {
        domain: DOMAINS.INTEGRATIONS.value,
        action: DOMAINS.INTEGRATIONS.actions.VIEW_STATUS,
      },
      { domain: DOMAINS.API_KEYS.value, action: DOMAINS.API_KEYS.actions.VIEW },
      {
        domain: DOMAINS.API_KEYS.value,
        action: DOMAINS.API_KEYS.actions.CREATE,
      },
      { domain: DOMAINS.API_KEYS.value, action: DOMAINS.API_KEYS.actions.EDIT },
      {
        domain: DOMAINS.API_KEYS.value,
        action: DOMAINS.API_KEYS.actions.DELETE,
      },
      {
        domain: DOMAINS.API_KEYS.value,
        action: DOMAINS.API_KEYS.actions.REGENERATE,
      },
      { domain: DOMAINS.WEBHOOKS.value, action: DOMAINS.WEBHOOKS.actions.VIEW },
      {
        domain: DOMAINS.WEBHOOKS.value,
        action: DOMAINS.WEBHOOKS.actions.CREATE,
      },
      { domain: DOMAINS.WEBHOOKS.value, action: DOMAINS.WEBHOOKS.actions.EDIT },
      {
        domain: DOMAINS.WEBHOOKS.value,
        action: DOMAINS.WEBHOOKS.actions.DELETE,
      },
      { domain: DOMAINS.WEBHOOKS.value, action: DOMAINS.WEBHOOKS.actions.TEST },
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.MAINTENANCE,
      },
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.CACHE,
      },
      {
        domain: DOMAINS.SETTINGS.value,
        action: DOMAINS.SETTINGS.actions.PERFORMANCE,
      },
    ],
  },
];
