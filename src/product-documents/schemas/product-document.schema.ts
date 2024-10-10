import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ProductDocument extends Document {
  @Prop({ required: true })
  projectKey: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  jiraSynced: boolean;
}

export type ProductDocumentDocument = ProductDocument & Document;
export const ProductDocumentSchema =
  SchemaFactory.createForClass(ProductDocument);
