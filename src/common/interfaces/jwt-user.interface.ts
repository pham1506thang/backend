import { Types } from "mongoose";

export interface JwtPayload {
  _id: string;
  username: string;
  roles: string[];
}

export interface JwtUser {
  _id: Types.ObjectId;
  username: string;
  roles: Types.ObjectId[];
}
