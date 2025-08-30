import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  @Get()
  getConfiguration() {
    return {
      message: 'Application configuration (non-sensitive values only)',
      config: {
        app: {
          name: this.configService.get<string>('app.name'),
          version: this.configService.get<string>('app.version'),
          port: this.configService.get<number>('app.port'),
          environment: this.configService.get<string>('app.environment'),
        },
        database: {
          host: this.configService.get<string>('database.host'),
          port: this.configService.get<number>('database.port'),
          name: this.configService.get<string>('database.database'),
          // Never expose passwords!
          // password: this.configService.get<string>('database.password'), ❌
        },
        redis: {
          host: this.configService.get<string>('redis.host'),
          port: this.configService.get<number>('redis.port'),
        },
        auth: {
          jwt: {
            expiresIn: this.configService.get<string>('auth.jwt.expiresIn'),
            issuer: this.configService.get<string>('auth.jwt.issuer'),
            // Never expose secrets!
            // secret: this.configService.get<string>('auth.jwt.secret'), ❌
          },
          auth0: {
            domain: this.configService.get<string>('auth.auth0.domain'),
            audience: this.configService.get<string>('auth.auth0.audience'),
            // Never expose client secrets!
          },
        },
        features: {
          corsEnabled: this.configService.get<boolean>('app.cors.enabled'),
          rateLimit: this.configService.get('app.rateLimit'),
          upload: this.configService.get('app.upload'),
        },
      },
    };
  }

  @Get('health')
  getHealthCheck() {
    const requiredConfigs = [
      'app.name',
      'database.host',
      'redis.host',
      'auth.jwt.secret',
    ];

    const missingConfigs = requiredConfigs.filter(
      config => !this.configService.get(config)
    );

    return {
      status: missingConfigs.length === 0 ? 'healthy' : 'unhealthy',
      environment: this.configService.get<string>('app.environment'),
      missingConfigs: missingConfigs.length > 0 ? missingConfigs : undefined,
      timestamp: new Date(),
    };
  }

  @Get('env-demo')
  getEnvironmentDemo() {
    // Demonstrating different ways to access configuration
    return {
      message: 'Different ways to access environment variables',
      examples: {
        direct: {
          description: 'Direct access with default values',
          nodeEnv: this.configService.get<string>('NODE_ENV', 'development'),
          port: this.configService.get<number>('PORT', 3000),
        },
        
        namespaced: {
          description: 'Namespaced configuration access',
          appName: this.configService.get<string>('app.name'),
          databaseHost: this.configService.get<string>('database.host'),
          redisPort: this.configService.get<number>('redis.port'),
        },
        
        typed: {
          description: 'Type-safe configuration access',
          rateLimit: this.configService.get<{ttl: number, requests: number}>('app.rateLimit'),
          cors: this.configService.get<{enabled: boolean, allowedOrigins: string[]}>('app.cors'),
        },
        
        validation: {
          description: 'Configuration with validation status',
          isValidConfig: this.configService.get('NODE_ENV') !== undefined,
          hasRequiredSecrets: Boolean(
            this.configService.get('auth.jwt.secret') &&
            this.configService.get('database.password')
          ),
        },
      },
    };
  }

  @Get('secrets-demo')
  getSecretsDemo() {
    return {
      message: 'Secrets and sensitive data handling demonstration',
      guidelines: {
        '✅ Safe to expose': [
          'Application name and version',
          'Database host and port (in development)',
          'Feature flags and public settings',
          'API endpoints and public URLs',
        ],
        '❌ Never expose': [
          'Database passwords',
          'JWT secrets',
          'API keys (OpenAI, SendGrid, etc.)',
          'OAuth client secrets',
          'Webhook URLs with tokens',
        ],
      },
      examples: {
        safe: {
          appName: this.configService.get<string>('app.name'),
          environment: this.configService.get<string>('app.environment'),
          publicApiVersion: this.configService.get<string>('app.version'),
        },
        masked: {
          jwtSecretLength: this.configService.get<string>('auth.jwt.secret')?.length || 0,
          hasOpenAIKey: Boolean(this.configService.get('externalApis.openai.apiKey')),
          hasDatabasePassword: Boolean(this.configService.get('database.password')),
          hasAuth0Secret: Boolean(this.configService.get('auth.auth0.clientSecret')),
        },
      },
    };
  }
}