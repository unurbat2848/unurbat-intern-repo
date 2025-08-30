import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('NestJS App'),
  API_VERSION: Joi.string().default('v1'),
  
  // Database Configuration (required in production)
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_MAX_CONNECTIONS: Joi.number().min(1).max(100).default(10),
  
  // Redis Configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_URL: Joi.string().uri().optional(),
  
  // JWT Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  JWT_ISSUER: Joi.string().optional(),
  JWT_AUDIENCE: Joi.string().optional(),
  
  // Auth0 Configuration (optional for development)
  AUTH0_DOMAIN: Joi.string().hostname().optional(),
  AUTH0_CLIENT_ID: Joi.string().optional(),
  AUTH0_CLIENT_SECRET: Joi.string().optional(),
  AUTH0_AUDIENCE: Joi.string().uri().optional(),
  AUTH0_SCOPE: Joi.string().default('openid profile email'),
  
  // External API Keys (optional in development, required in production)
  OPENAI_API_KEY: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  SENDGRID_API_KEY: Joi.when('NODE_ENV', {
    is: 'production', 
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  SLACK_WEBHOOK_URL: Joi.string().uri().optional(),
  
  // File Upload
  MAX_FILE_SIZE: Joi.number().min(1024).max(104857600).default(10485760), // 1KB to 100MB
  UPLOAD_FOLDER: Joi.string().default('uploads'),
  
  // Rate Limiting
  RATE_LIMIT_TTL: Joi.number().min(1).default(60),
  RATE_LIMIT_REQUESTS: Joi.number().min(1).default(100),
  
  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
  LOG_FILE: Joi.string().default('logs/app.log'),
  
  // Security settings
  ALLOWED_ORIGINS: Joi.string().optional(),
  SESSION_SECRET: Joi.string().min(32).optional(),
  SESSION_MAX_AGE: Joi.number().min(60000).default(86400000), // min 1 minute, default 24 hours
  
  // OAuth providers (optional)
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),
  GITHUB_CLIENT_ID: Joi.string().optional(),
  GITHUB_CLIENT_SECRET: Joi.string().optional(),
  
  // AWS Configuration (optional)
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),
  
  // Stripe Configuration (optional)
  STRIPE_PUBLISHABLE_KEY: Joi.string().optional(),
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
  STRIPE_CURRENCY: Joi.string().length(3).default('usd'),
});