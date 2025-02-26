import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DomainDocument = Domain & Document;

@Schema({ timestamps: true })
export class Domain {
  @Prop({ required: true, unique: true })
  code: string;
  @Prop({ required: true })
  label: string;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
