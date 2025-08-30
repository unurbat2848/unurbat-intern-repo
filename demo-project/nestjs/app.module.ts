import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';
import { ProductsModule } from './products/products.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';

// Module that registers all providers and controllers
@Module({
  imports: [ProductsModule],
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