import { SetMetadata } from '@nestjs/common';

export const RolePermission = (domain: string, action: string) =>
  SetMetadata('role-permission', { domain, action });
