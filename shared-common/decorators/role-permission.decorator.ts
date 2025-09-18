import { SetMetadata } from '@nestjs/common';

export const ROLE_PERMISSION_KEY = 'role-permission';

export const RolePermission = (domain: string, action: string) =>
  SetMetadata(ROLE_PERMISSION_KEY, { domain, action });
