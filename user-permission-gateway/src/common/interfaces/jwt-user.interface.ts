export interface JWTUser {
  id: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
