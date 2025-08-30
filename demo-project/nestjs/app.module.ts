import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seeding/seed.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';

// Module that registers all providers and controllers
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'nestuser',
      password: process.env.DB_PASSWORD || 'nestpass',
      database: process.env.DB_NAME || 'nestdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Disabled to use migrations
    }),
    ProductsModule,
    UsersModule,
    SeedModule
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