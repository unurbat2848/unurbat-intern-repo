// Load environment variables first, before any other imports
import * as dotenv from 'dotenv';
dotenv.config();

// Debug: Check if environment variables are loaded
console.log('🔑 ENCRYPTION_KEY loaded:', process.env.ENCRYPTION_KEY ? `Yes (${process.env.ENCRYPTION_KEY.length} chars)` : 'No');

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { Logger } from 'nestjs-pino'; // Temporarily disabled
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './nestjs/app.module';
// import { LoggingInterceptor } from './nestjs/interceptors/logging.interceptor';
// import { ResponseTransformInterceptor } from './nestjs/interceptors/response-transform.interceptor';
// import { ErrorHandlingInterceptor } from './nestjs/interceptors/error-handling.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  // Use Pino logger - temporarily disabled
  // app.useLogger(app.get(Logger));
  
  // Security Middleware - Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    }
  }));
  
  // Rate limiting to prevent abuse
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      statusCode: 429
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }));
  
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
  
  // Apply global interceptors (order matters!) - temporarily disabled
  // app.useGlobalInterceptors(
  //   new ErrorHandlingInterceptor(), // Should be first to catch all errors
  //   new LoggingInterceptor(),       // Log requests and responses
  //   new ResponseTransformInterceptor() // Transform response format (should be last)
  // );
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 NestJS app is running on: http://localhost:${port}/api`);
}
bootstrap();