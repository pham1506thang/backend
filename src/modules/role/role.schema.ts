import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base.schema';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends BaseSchema {
  @Prop({ required: true, unique: true, type: String })
  code: string; // "admin", "editor", "viewer"

  @Prop({ required: true, type: String })
  label: string;

  @Prop({ required: true, type: Number })
  priority: number;

  @Prop([
    {
      domain: { type: Types.ObjectId, ref: 'Domain', required: true },
      actions: [{ type: Types.ObjectId, ref: 'Action', required: true }],
    },
  ])
  permissions: { domain: Types.ObjectId; actions: Types.ObjectId[] }[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
