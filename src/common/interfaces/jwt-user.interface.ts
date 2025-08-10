export interface JwtPayload {
  id: string;
  username: string;
  roles: string[];
}

export interface JwtUser {
  id: string;
  username: string;
  roles: string[];
}
