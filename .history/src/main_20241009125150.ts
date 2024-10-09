import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
