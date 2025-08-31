import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from './validation.schema';
import { validate } from './environment-variables';
import { ConfigController } from './config.controller';

// Import all configuration files
import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import authConfig from './auth.config';
import externalApisConfig from './external-apis.config';
import encryptionConfig from './encryption.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        databaseConfig, 
        redisConfig,
        authConfig,
        externalApisConfig,
        encryptionConfig,
      ],
      
      // Environment-specific .env files
      envFilePath: [
        '.env.local',                    // Local overrides (highest priority)
        `.env.${process.env.NODE_ENV}`,  // Environment-specific
        '.env',                          // Default fallback
      ],
      
      // Use Joi validation schema
      validationSchema,
      validationOptions: {
        abortEarly: false, // Show all validation errors
        allowUnknown: true, // Allow extra environment variables
      },
      
      // Alternative: use class-validator approach
      // validate,
      
      // Expand variables (e.g., DATABASE_URL=${DB_HOST}:${DB_PORT}/${DB_NAME})
      expandVariables: true,
    }),
  ],
  controllers: [ConfigController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}