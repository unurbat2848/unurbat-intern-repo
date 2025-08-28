import { NestFactory } from '@nestjs/core';
import { AppModule } from './dependency-injection-nestjs/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for development
  app.enableCors();
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 NestJS app is running on: http://localhost:${port}/api`);
}
bootstrap();