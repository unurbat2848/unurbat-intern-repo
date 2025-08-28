import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';

// Module that registers all providers and controllers
@Module({
  imports: [],
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