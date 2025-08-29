import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './nestjs/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for development
  app.enableCors();
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error for extra properties
    transform: true, // Auto-transform request objects to DTO instances
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 NestJS app is running on: http://localhost:${port}/api`);
}
bootstrap();