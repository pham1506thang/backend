import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/schemas/base.schema';

export type DomainDocument = Domain & Document;

@Schema()
export class Domain extends BaseSchema {
  @Prop({ required: true, unique: true })
  code: string;
  @Prop({ required: true })
  label: string;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
