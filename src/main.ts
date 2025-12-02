import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FileLogger } from './common/logger/file-logger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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
  
    const config = new DocumentBuilder()
    .setTitle('Board War API')
    .setDescription('API documentation for Board War backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // UI Swaggera pod /api
  SwaggerModule.setup('api', app, document);

  // RĘCZNIE dodany JSON pod /api-json
  app.use('/api-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
