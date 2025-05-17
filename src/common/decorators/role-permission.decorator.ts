import { SetMetadata } from '@nestjs/common';
import { Action, Domain } from 'common/constants/permissions';

export const RolePermission = (domain: Domain, action: Action) =>
  SetMetadata('role-permission', { domain, action });
