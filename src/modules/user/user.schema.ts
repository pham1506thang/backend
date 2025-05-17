import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from 'common/schemas/base.schema';

export type UserDocument = Document & User;

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: false })
  name?: string;
  @Prop({ required: false })
  email?: string;
  @Prop({ type: Date, required: false })
  lastLogin?: Date;
  @Prop({ 
    type: [{ type: Types.ObjectId, ref: 'Role' }],
    default: [] 
  })
  roles: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
