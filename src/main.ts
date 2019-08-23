import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appPrefix = 'openapipl/sb/v2_1_1.1';
  app.setGlobalPrefix(appPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const customersOptions = new DocumentBuilder()
    .addTag('customers')
    .setBasePath(appPrefix)
    .setHost(process.env.HOST_NAME)
    .build();
  const customersDocument = SwaggerModule.createDocument(app, customersOptions);
  SwaggerModule.setup('/docs', app, customersDocument);

  const accountsOptions = new DocumentBuilder()
    .addTag('accounts')
    .setBasePath(appPrefix)
    .setHost(process.env.HOST_NAME)
    .build();
  const accountsDocument = SwaggerModule.createDocument(app, accountsOptions);
  SwaggerModule.setup('/docs', app, accountsDocument);

  const applicationsOptions = new DocumentBuilder()
    .addTag('applications')
    .setBasePath(appPrefix)
    .setHost(process.env.HOST_NAME)
    .build();
  const applicationsDocument = SwaggerModule.createDocument(
    app,
    applicationsOptions,
  );
  SwaggerModule.setup('/docs', app, applicationsDocument);

  await app.listen(8089);
}
bootstrap();
