export const Domains = {
  Auths: 'auths',
  Users: 'users',
  Roles: 'roles',
  Products: 'products',
  Orders: 'orders',
  Dashboard: 'dashboard',
  Analytics: 'analytics',
  Reports: 'reports',
} as const;

export type DomainType = (typeof Domains)[keyof typeof Domains];

// Get array of all domain values
export const DomainValues = Object.values(Domains); 

export const Actions = {
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
} as const;

export type ActionType = (typeof Actions)[keyof typeof Actions];

export const ActionValues = Object.values(Actions);

export interface Permission {
  domain: DomainType;
  actions: ActionType[];
}