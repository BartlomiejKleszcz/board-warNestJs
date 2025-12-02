import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { FileLogger } from './common/logger/file-logger';

async function bootstrap() {
  const logger = new FileLogger('Bootstrap');
  const app = await NestFactory.create(AppModule, { logger });

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map(o => o.trim()).filter(Boolean) || 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Board War API')
    .setDescription('API documentation for Board War backend')
    .setVersion('1.0')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = 'api'; 
  SwaggerModule.setup(swaggerPath, app, swaggerDoc, {
    jsonDocumentUrl: 'api-json',
    customSiteTitle: 'Board War API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
