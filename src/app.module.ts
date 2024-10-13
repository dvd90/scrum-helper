import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductDocumentsModule } from './product-documents/product-documents.module';
import { PrdProcessingService } from './services/prd-processing/prd-processing.service';
import { JiraService } from './services/jira/jira.service';
import { OpenAiService } from './services/openai/openai.service';
import { TasksModule } from './tasks/tasks.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductDocumentsModule,
    UsersModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, OpenAiService, JiraService, PrdProcessingService],
})
export class AppModule {}
