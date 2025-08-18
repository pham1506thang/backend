import { Role } from './role.entity';

export interface SummaryRole
  extends Pick<
    Role,
    'id' | 'code' | 'label' | 'isAdmin' | 'isSuperAdmin' | 'isProtected'
  > {}
