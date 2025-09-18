import { DOMAINS } from 'shared-common';

export const DEFAULT_ROLES = [
  {
    code: 'reader',
    label: 'Độc giả',
    description:
      'Người dùng có thể đọc bài viết, tạo bình luận và quản lý thông tin cá nhân',
    permissions: [
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.EDIT },
    ],
  },
  {
    code: 'admin',
    label: 'Admin',
    description: 'Có quyền quản trị hệ thống với các chức năng admin cơ bản',
    isAdmin: true,
    permissions: [
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.VIEW },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.EDIT },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.CREATE },
      { domain: DOMAINS.USERS.value, action: DOMAINS.USERS.actions.DELETE },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.VIEW },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.CREATE },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.EDIT },
      { domain: DOMAINS.ROLES.value, action: DOMAINS.ROLES.actions.DELETE },
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
];
