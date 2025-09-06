import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bullmq'; // Temporarily disabled
import { ConfigModule } from './config/config.module';
import { ConfigService } from '@nestjs/config';
import { LoggingModule } from './logging/logging.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { UserController } from './user.controller';
import { SecurityController } from './controllers/security.controller';
import { EncryptionTestController } from './controllers/encryption-test.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { SeedModule } from './seeding/seed.module';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { SecurityMiddleware } from './middleware/security.middleware';
import { DebugModule } from './debug/debug.module';

// Module that registers all providers and controllers
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    // BullModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     connection: {
    //       host: configService.get<string>('redis.host'),
    //       port: configService.get<number>('redis.port'),
    //       password: configService.get<string>('redis.password'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    // LoggingModule, // Temporarily disabled
    ProductsModule,
    UsersModule,
    DebugModule,
    // SeedModule, // Temporarily disabled
    // JobsModule, // Temporarily disabled (depends on BullMQ)
    // AuthModule // Temporarily disabled
  ],
  controllers: [UserController, SecurityController, EncryptionTestController],
  providers: [
    UserService,    // SINGLETON scope (default)
    EmailService,   // REQUEST scope
    LoggerService,  // TRANSIENT scope
    
    // Global exception filters - temporarily disabled
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
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