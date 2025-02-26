import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true, type: String })
  code: string; // "admin", "editor", "viewer"

  @Prop({ required: true, type: String })
  label: string;

  @Prop({ required: true, type: Number})
  weight: number;

  @Prop([
    {
      domain: { type: Types.ObjectId, ref: 'Domain', required: true },
      actions: [{ type: Types.ObjectId, ref: 'Action', required: true }],
    },
  ])
  permissions: { domain: Types.ObjectId; actions: Types.ObjectId[] }[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
