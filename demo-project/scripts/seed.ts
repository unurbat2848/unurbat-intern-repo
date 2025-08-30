import { NestFactory } from '@nestjs/core';
import { AppModule } from '../nestjs/app.module';
import { SeedService } from '../nestjs/seeding/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  
  try {
    await seedService.seedAll();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();