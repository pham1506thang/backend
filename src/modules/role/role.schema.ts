import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 
import { BaseSchema } from 'common/schemas/base.schema';
import { Permission } from 'common/constants/permissions';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role extends BaseSchema {
  @Prop({ required: true, unique: true, type: String })
  code: string;

  @Prop({ required: true, type: String })
  label: string;

  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @Prop({ type: Boolean, default: false })
  isProtected: boolean;

  @Prop({
    type: [Object],
    default: []
  })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
