import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base.schema';

export type ActionDocument = Action & Document;

@Schema()
export class Action extends BaseSchema {
  @Prop({ required: true, unique: true })
  code: string;
  @Prop({ required: true })
  label: string;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
