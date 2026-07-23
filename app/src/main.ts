import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // Strip unknown properties
      forbidNonWhitelisted: true,  // Throw error on unknown properties
      transform: true,             // Transform plain objects to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger OpenAPI setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Management System API')
    .setDescription(
      'RESTful API for managing customer profiles, contacts, addresses and documents.\n\n' +
      '**Base URL:** `/api/v1`\n\n' +
      '**Features:** Full CRUD, pagination, search, filter, document upload',
    )
    .setVersion('1.0')
    .addTag('Customers', 'Customer CRUD operations')
    .addTag('Health', 'Application health check')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  // 1. Swagger UI at /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // 2. Scalar API Reference at /api/scalar
  app.use(
    '/api/scalar',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
    }),
  );

  const port = process.env.PORT || 4001;
  await app.listen(port);

  console.log(`\n🚀 Application running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📖 Swagger UI:             http://localhost:${port}/api/docs`);
  console.log(`🎨 Scalar API Docs:        http://localhost:${port}/api/scalar\n`);
}

bootstrap();
