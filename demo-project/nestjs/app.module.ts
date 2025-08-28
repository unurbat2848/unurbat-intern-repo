import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';
import { ProductsModule } from './products/products.module';

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
export class AppModule {
  constructor() {
    console.log('AppModule created - NestJS will handle all dependency injection!');
  }
}