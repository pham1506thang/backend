import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base.schema';

export type UserDocument = Document & User;

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, type: Types.ObjectId, ref: 'Role' })
  role: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
