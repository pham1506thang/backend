import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActionDocument = Action & Document;

@Schema({ timestamps: true })
export class Action {
  @Prop({ required: true, unique: true })
  code: string;
  @Prop({ required: true })
  label: string;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
