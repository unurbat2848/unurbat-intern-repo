import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './nestjs/app.module';
import { LoggingInterceptor } from './nestjs/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './nestjs/interceptors/response-transform.interceptor';
import { ErrorHandlingInterceptor } from './nestjs/interceptors/error-handling.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  // Use Pino logger
  app.useLogger(app.get(Logger));
  
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
  
  // Apply global interceptors (order matters!)
  app.useGlobalInterceptors(
    new ErrorHandlingInterceptor(), // Should be first to catch all errors
    new LoggingInterceptor(),       // Log requests and responses
    new ResponseTransformInterceptor() // Transform response format (should be last)
  );
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  const logger = app.get(Logger);
  logger.log(`🚀 NestJS app is running on: http://localhost:${port}/api`);
}
bootstrap();