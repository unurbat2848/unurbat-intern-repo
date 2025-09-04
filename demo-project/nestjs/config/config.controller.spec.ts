import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ConfigController } from './config.controller';

describe('ConfigController', () => {
  let controller: ConfigController;
  let configService: ConfigService;

  // Mock the ConfigService
  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigController],
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ConfigController>(ConfigController);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConfiguration', () => {
    it('should return configuration with all required fields', () => {
      // Mock config values
      mockConfigService.get.mockImplementation((key: string) => {
        const configMap: Record<string, any> = {
          'app.name': 'TestApp',
          'app.version': '1.0.0',
          'app.port': 3000,
          'app.environment': 'test',
          'database.host': 'localhost',
          'database.port': 5432,
          'database.database': 'testdb',
          'redis.host': 'localhost',
          'redis.port': 6379,
          'auth.jwt.expiresIn': '1h',
          'auth.jwt.issuer': 'testapp',
          'auth.auth0.domain': 'testapp.auth0.com',
          'auth.auth0.audience': 'testapp-api',
          'app.cors.enabled': true,
          'app.rateLimit': { ttl: 60, limit: 100 },
          'app.upload': { maxSize: 1048576 },
        };
        return configMap[key];
      });

      const result = controller.getConfiguration();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('config');
      expect(result.config).toHaveProperty('app');
      expect(result.config).toHaveProperty('database');
      expect(result.config).toHaveProperty('redis');
      expect(result.config).toHaveProperty('auth');
      expect(result.config).toHaveProperty('features');

      // Verify specific values
      expect(result.config.app.name).toBe('TestApp');
      expect(result.config.app.version).toBe('1.0.0');
      expect(result.config.database.host).toBe('localhost');
      expect(result.config.redis.port).toBe(6379);
    });

    it('should call ConfigService.get for each configuration key', () => {
      mockConfigService.get.mockReturnValue('mock-value');

      controller.getConfiguration();

      // Should call get() for each config key
      expect(mockConfigService.get).toHaveBeenCalledWith('app.name');
      expect(mockConfigService.get).toHaveBeenCalledWith('database.host');
      expect(mockConfigService.get).toHaveBeenCalledWith('redis.port');
      expect(mockConfigService.get).toHaveBeenCalledWith('auth.jwt.expiresIn');
    });

    it('should handle missing configuration values gracefully', () => {
      // Mock some missing values
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'app.name') return undefined;
        if (key === 'database.host') return null;
        return 'default-value';
      });

      const result = controller.getConfiguration();

      expect(result.config.app.name).toBeUndefined();
      expect(result.config.database.host).toBeNull();
    });
  });

  describe('getHealthCheck', () => {
    it('should return healthy status when all required configs exist', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const configMap: Record<string, any> = {
          'app.name': 'TestApp',
          'app.environment': 'test',
          'database.host': 'localhost',
          'redis.host': 'redis-server',
          'auth.jwt.secret': 'supersecret',
        };
        return configMap[key];
      });

      const result = controller.getHealthCheck();

      expect(result.status).toBe('healthy');
      expect(result.environment).toBeDefined();
      expect(result.missingConfigs).toBeUndefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return unhealthy status when required configs are missing', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const configMap: Record<string, any> = {
          'app.name': 'TestApp',
          'database.host': undefined, // Missing
          'redis.host': null, // Missing
          'auth.jwt.secret': undefined, // Missing
        };
        return configMap[key];
      });

      const result = controller.getHealthCheck();

      expect(result.status).toBe('unhealthy');
      expect(result.missingConfigs).toHaveLength(3);
      expect(result.missingConfigs).toContain('database.host');
      expect(result.missingConfigs).toContain('redis.host');
      expect(result.missingConfigs).toContain('auth.jwt.secret');
    });

    it('should include timestamp in health check response', () => {
      mockConfigService.get.mockReturnValue('test-value');
      const beforeCall = new Date();

      const result = controller.getHealthCheck();

      const afterCall = new Date();
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });
  });

  describe('getEnvironmentDemo', () => {
    it('should demonstrate different configuration access patterns', () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue?: any) => {
        const configMap: Record<string, any> = {
          'NODE_ENV': 'test',
          'PORT': 3000,
          'app.name': 'DemoApp',
          'database.host': 'db.example.com',
          'redis.port': 6379,
          'app.rateLimit': { ttl: 60, requests: 100 },
          'app.cors': { enabled: true, allowedOrigins: ['*'] },
          'auth.jwt.secret': 'test-secret',
          'database.password': 'test-password',
        };
        return configMap[key] !== undefined ? configMap[key] : defaultValue;
      });

      const result = controller.getEnvironmentDemo();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('examples');
      expect(result.examples).toHaveProperty('direct');
      expect(result.examples).toHaveProperty('namespaced');
      expect(result.examples).toHaveProperty('typed');
      expect(result.examples).toHaveProperty('validation');

      // Check direct access with defaults
      expect(result.examples.direct.nodeEnv).toBe('test');
      expect(result.examples.direct.port).toBe(3000);

      // Check namespaced access
      expect(result.examples.namespaced.appName).toBe('DemoApp');

      // Check validation
      expect(result.examples.validation.isValidConfig).toBe(true);
      expect(result.examples.validation.hasRequiredSecrets).toBe(true);
    });

    it('should use default values when environment variables are missing', () => {
      mockConfigService.get.mockImplementation((key: string, defaultValue?: any) => {
        // Simulate missing NODE_ENV and PORT
        if (key === 'NODE_ENV') return undefined;
        if (key === 'PORT') return undefined;
        return defaultValue;
      });

      const result = controller.getEnvironmentDemo();

      expect(result.examples.direct.nodeEnv).toBe('development'); // default
      expect(result.examples.direct.port).toBe(3000); // default
    });
  });

  describe('getSecretsDemo', () => {
    it('should return safe configuration information', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const configMap: Record<string, any> = {
          'app.name': 'SecureApp',
          'app.environment': 'production',
          'app.version': '2.0.0',
          'auth.jwt.secret': 'very-long-secret-key-here',
          'externalApis.openai.apiKey': 'sk-1234567890abcdef',
          'database.password': 'super-secret-db-password',
          'auth.auth0.clientSecret': 'auth0-client-secret',
        };
        return configMap[key];
      });

      const result = controller.getSecretsDemo();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('guidelines');
      expect(result).toHaveProperty('examples');

      // Check safe examples (should show actual values)
      expect(result.examples.safe.appName).toBe('SecureApp');
      expect(result.examples.safe.environment).toBe('production');

      // Check masked examples (should not show sensitive values)
      expect(result.examples.masked.jwtSecretLength).toBe(25); // Length of secret
      expect(result.examples.masked.hasOpenAIKey).toBe(true); // Boolean, not actual key
      expect(result.examples.masked.hasDatabasePassword).toBe(true);
      expect(result.examples.masked.hasAuth0Secret).toBe(true);

      // Ensure no actual secrets are exposed
      const responseString = JSON.stringify(result);
      expect(responseString).not.toContain('very-long-secret-key-here');
      expect(responseString).not.toContain('sk-1234567890abcdef');
      expect(responseString).not.toContain('super-secret-db-password');
    });

    it('should handle missing secrets gracefully', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const configMap: Record<string, any> = {
          'app.name': 'TestApp',
          'app.environment': 'test',
          'app.version': '1.0.0',
          // Missing all secrets
        };
        return configMap[key];
      });

      const result = controller.getSecretsDemo();

      expect(result.examples.masked.jwtSecretLength).toBe(0);
      expect(result.examples.masked.hasOpenAIKey).toBe(false);
      expect(result.examples.masked.hasDatabasePassword).toBe(false);
      expect(result.examples.masked.hasAuth0Secret).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle ConfigService throwing errors', () => {
      mockConfigService.get.mockImplementation(() => {
        throw new Error('Configuration error');
      });

      expect(() => controller.getConfiguration()).toThrow('Configuration error');
    });

    it('should handle null ConfigService responses', () => {
      mockConfigService.get.mockReturnValue(null);

      const result = controller.getConfiguration();

      // Should handle null values gracefully
      expect(result.config.app.name).toBeNull();
      expect(result.config.database.host).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should work with realistic production-like config', () => {
      const productionConfig: Record<string, any> = {
        'app.name': 'FocusBear',
        'app.version': '3.1.4',
        'app.port': 8080,
        'app.environment': 'production',
        'database.host': 'prod-db.company.com',
        'database.port': 5432,
        'redis.host': 'redis.company.com',
        'redis.port': 6379,
        'auth.jwt.expiresIn': '24h',
        'auth.jwt.secret': 'production-jwt-secret',
      };

      mockConfigService.get.mockImplementation((key: string, defaultValue?: any) => {
        return productionConfig[key] || defaultValue;
      });

      const config = controller.getConfiguration();
      const health = controller.getHealthCheck();

      expect(config.config.app.name).toBe('FocusBear');
      expect(config.config.app.environment).toBe('production');
      expect(health.status).toBe('healthy');
    });
  });
});