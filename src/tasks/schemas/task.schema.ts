import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop()
  type: 'Task' | 'Epic' | 'Story';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ProductDocument', required: true })
  productDocumentId: Types.ObjectId;

  @Prop()
  key: string;

  @Prop()
  projectKey: string;

  @Prop()
  summary: string;

  @Prop()
  description: string;

  @Prop()
  epicKey: string;

  @Prop({ default: false })
  jiraSynced: boolean;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
