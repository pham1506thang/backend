export interface JwtPayload {
  _id: string;
  username: string;
  roles: string[];
}

export interface JwtUser {
  _id: string;
  username: string;
  roles: string[];
}
