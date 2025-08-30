import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seeding/seed.module';
import { JobsModule } from './jobs/jobs.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';

// Module that registers all providers and controllers
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'myuser',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'mydatabase',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Disabled to use migrations
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    ProductsModule,
    UsersModule,
    SeedModule,
    JobsModule
  ],
  controllers: [UserController],
  providers: [
    UserService,    // SINGLETON scope (default)
    EmailService,   // REQUEST scope
    LoggerService,  // TRANSIENT scope
  ],
})
export class AppModule implements NestModule {
  constructor() {
    console.log('AppModule created - NestJS will handle all dependency injection!');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware, RequestIdMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}