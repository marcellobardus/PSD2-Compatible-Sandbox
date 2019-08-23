import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('openapipl/sb/v2_1_1.1');
  await app.listen(3000);
}
bootstrap();
