import { SetMetadata } from '@nestjs/common';
import { ActionType, DomainType } from 'common/constants/permissions';

export const RolePermission = (domain: DomainType, action: ActionType) =>
  SetMetadata('role-permission', { domain, action });
