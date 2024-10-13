import { Module } from '@nestjs/common';
import { ProductDocumentsService } from './product-documents.service';
import { ProductDocumentsController } from './product-documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductDocument,
  ProductDocumentSchema,
} from './schemas/product-document.schema';
import { PrdProcessingService } from 'src/services/prd-processing/prd-processing.service';
import { OpenAiService } from 'src/services/openai/openai.service';
import { JiraService } from 'src/services/jira/jira.service';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Task, TaskSchema } from '../tasks/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductDocument.name, schema: ProductDocumentSchema },
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductDocumentsController],
  providers: [
    ProductDocumentsService,
    OpenAiService,
    JiraService,
    PrdProcessingService,
    UsersService,
  ],
  exports: [
    ProductDocumentsService,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
})
export class ProductDocumentsModule {}
