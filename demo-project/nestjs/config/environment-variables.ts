import { IsString, IsNumber, IsOptional, IsIn, IsUrl, Min, Max, validateSync } from 'class-validator';
import { Transform } from 'class-transformer';
import { plainToClass } from 'class-transformer';

export class EnvironmentVariables {
  @IsIn(['development', 'staging', 'production', 'test'])
  NODE_ENV: string = 'development';

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1024)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  APP_NAME: string = 'NestJS App';

  // Database
  @IsString()
  DB_HOST: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @Max(65535)
  DB_PORT: number = 5432;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  // Redis
  @IsString()
  REDIS_HOST: string = 'localhost';

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  @Max(65535)
  REDIS_PORT: number = 6379;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  // JWT
  @IsString()
  @Min(32)
  JWT_SECRET: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string = '24h';

  // Auth0 (optional)
  @IsOptional()
  @IsString()
  AUTH0_DOMAIN?: string;

  @IsOptional()
  @IsString()
  AUTH0_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  AUTH0_CLIENT_SECRET?: string;

  @IsOptional()
  @IsUrl()
  AUTH0_AUDIENCE?: string;

  // External APIs
  @IsOptional()
  @IsString()
  OPENAI_API_KEY?: string;

  @IsOptional()
  @IsString()
  SENDGRID_API_KEY?: string;

  @IsOptional()
  @IsUrl()
  SLACK_WEBHOOK_URL?: string;

  // File Upload
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1024)
  @Max(104857600)
  MAX_FILE_SIZE: number = 10485760;

  // Rate Limiting
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  RATE_LIMIT_TTL: number = 60;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  RATE_LIMIT_REQUESTS: number = 100;

  // Logging
  @IsIn(['error', 'warn', 'info', 'debug', 'verbose'])
  LOG_LEVEL: string = 'info';
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { 
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map(error => {
      const constraints = Object.values(error.constraints || {});
      return `${error.property}: ${constraints.join(', ')}`;
    });
    
    throw new Error(`Configuration validation error:\n${errorMessages.join('\n')}`);
  }

  return validatedConfig;
}