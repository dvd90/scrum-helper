import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get the port from the environment variable or default to 3000
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
