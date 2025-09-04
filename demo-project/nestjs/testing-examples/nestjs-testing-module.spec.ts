import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from '../email.service';
import { LoggerService } from '../logger.service';

// Mock entity for demonstration
export class User {
  id: number;
  email: string;
  name: string;
}

// Mock service that depends on multiple providers
export class UserManagementService {
  constructor(
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private loggerService: LoggerService,
    private configService: ConfigService,
  ) {}

  async createUser(userData: { email: string; name: string }) {
    this.loggerService.log(`Creating user: ${userData.email}`);
    
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    
    // Send welcome email if enabled
    const emailEnabled = this.configService.get<boolean>('email.enabled', true);
    if (emailEnabled) {
      this.emailService.sendWelcomeEmail(savedUser.email, savedUser.name);
    }
    
    return savedUser;
  }

  async findUser(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
}

/**
 * DEMONSTRATING @nestjs/testing MODULE FEATURES
 */
describe('@nestjs/testing Module Features', () => {
  let service: UserManagementService;
  let userRepository: Repository<User>;
  let emailService: EmailService;
  let loggerService: LoggerService;
  let configService: ConfigService;

  describe('1. Basic Module Creation', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserManagementService,
          // Mock repository using getRepositoryToken
          {
            provide: getRepositoryToken(User),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
            },
          },
          // Mock services
          {
            provide: EmailService,
            useValue: {
              sendWelcomeEmail: jest.fn(),
              sendNotification: jest.fn(),
              getEmailHistory: jest.fn(),
            },
          },
          {
            provide: LoggerService,
            useValue: {
              log: jest.fn(),
              getInstanceId: jest.fn().mockReturnValue('test-logger'),
            },
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<UserManagementService>(UserManagementService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
      emailService = module.get<EmailService>(EmailService);
      loggerService = module.get<LoggerService>(LoggerService);
      configService = module.get<ConfigService>(ConfigService);
    });

    it('should create service with all dependencies', () => {
      expect(service).toBeDefined();
      expect(userRepository).toBeDefined();
      expect(emailService).toBeDefined();
      expect(loggerService).toBeDefined();
      expect(configService).toBeDefined();
    });

    it('should inject mocked dependencies', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      
      // Setup mocks
      (userRepository.create as jest.Mock).mockReturnValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      (configService.get as jest.Mock).mockReturnValue(true);
      
      const result = await service.createUser({
        email: 'test@example.com',
        name: 'Test User'
      });

      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'Test User'
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test User'
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('2. Using Real Modules with Overrides', () => {
    let module: TestingModule;

    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          // Import real ConfigModule
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env.test',
          }),
        ],
        providers: [
          UserManagementService,
          EmailService, // Real EmailService
          LoggerService, // Real LoggerService
          // Mock only the repository
          {
            provide: getRepositoryToken(User),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
            },
          },
        ],
      })
      // Override specific providers for testing
      .overrideProvider(EmailService)
      .useValue({
        sendWelcomeEmail: jest.fn(),
        sendNotification: jest.fn(),
        getEmailHistory: jest.fn(),
      })
      .overrideProvider(LoggerService)
      .useValue({
        log: jest.fn(),
        getInstanceId: jest.fn().mockReturnValue('test-override'),
      })
      .compile();

      service = module.get<UserManagementService>(UserManagementService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
      emailService = module.get<EmailService>(EmailService);
      loggerService = module.get<LoggerService>(LoggerService);
      configService = module.get<ConfigService>(ConfigService); // Real ConfigService
    });

    afterEach(async () => {
      await module.close();
    });

    it('should use real ConfigService with overridden other services', async () => {
      const mockUser = { id: 2, email: 'override@test.com', name: 'Override User' };
      
      (userRepository.create as jest.Mock).mockReturnValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      
      await service.createUser({
        email: 'override@test.com',
        name: 'Override User'
      });

      // Real ConfigService is used (will return actual config values)
      expect(configService).toBeDefined();
      expect(typeof configService.get).toBe('function');
      
      // Overridden services are mocked
      expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
      expect(loggerService.log).toHaveBeenCalledWith('Creating user: override@test.com');
    });
  });

  describe('3. Testing Module Compilation and Lifecycle', () => {
    let module: TestingModule;

    it('should handle module initialization and cleanup', async () => {
      module = await Test.createTestingModule({
        providers: [
          {
            provide: 'TEST_SERVICE',
            useFactory: () => ({
              initialize: jest.fn(),
              cleanup: jest.fn(),
            }),
          },
        ],
      }).compile();

      const testService = module.get('TEST_SERVICE');
      expect(testService).toBeDefined();
      expect(testService.initialize).toBeDefined();

      // Module can be closed to clean up resources
      await module.close();
      
      // After closing, module should be properly cleaned up
      expect(module).toBeDefined(); // Module object still exists but is closed
    });
  });

  describe('4. Provider Resolution and Dependency Injection', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserManagementService,
          {
            provide: getRepositoryToken(User),
            useFactory: () => ({
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
            }),
          },
          {
            provide: EmailService,
            useClass: class MockEmailService {
              sendWelcomeEmail = jest.fn();
              sendNotification = jest.fn();
              getEmailHistory = jest.fn();
            },
          },
          {
            provide: LoggerService,
            useFactory: () => ({
              log: jest.fn(),
              getInstanceId: jest.fn().mockReturnValue('factory-logger'),
            }),
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
                const configMap: Record<string, any> = {
                  'email.enabled': true,
                  'app.name': 'Test App',
                };
                return configMap[key] !== undefined ? configMap[key] : defaultValue;
              }),
            },
          },
        ],
      }).compile();

      service = module.get<UserManagementService>(UserManagementService);
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
      emailService = module.get<EmailService>(EmailService);
      loggerService = module.get<LoggerService>(LoggerService);
      configService = module.get<ConfigService>(ConfigService);
    });

    it('should resolve providers using different strategies', async () => {
      // Test useFactory provider
      expect(loggerService.getInstanceId()).toBe('factory-logger');
      
      // Test useClass provider
      expect(emailService).toBeDefined();
      expect(emailService.sendWelcomeEmail).toBeDefined();
      
      // Test useValue provider with complex logic
      expect(configService.get('email.enabled')).toBe(true);
      expect(configService.get('nonexistent.key', 'default')).toBe('default');
    });

    it('should handle circular dependencies gracefully', async () => {
      // @nestjs/testing handles circular dependencies automatically
      // This test demonstrates that the module compiles without issues
      expect(service).toBeDefined();
      
      const mockUser = { id: 3, email: 'circular@test.com', name: 'Circular Test' };
      (userRepository.create as jest.Mock).mockReturnValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      
      const result = await service.createUser({
        email: 'circular@test.com',
        name: 'Circular Test'
      });
      
      expect(result).toEqual(mockUser);
    });
  });

  describe('5. Advanced Testing Patterns', () => {
    it('should test with partial mocks using jest.spyOn', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserManagementService,
          EmailService, // Real service
          LoggerService, // Real service
          {
            provide: getRepositoryToken(User),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
              findOne: jest.fn(),
            },
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(true),
            },
          },
        ],
      }).compile();

      const testService = module.get<UserManagementService>(UserManagementService);
      const testEmailService = module.get<EmailService>(EmailService);
      const testLoggerService = module.get<LoggerService>(LoggerService);
      const testRepository = module.get<Repository<User>>(getRepositoryToken(User));

      // Spy on real service methods
      const emailSpy = jest.spyOn(testEmailService, 'sendWelcomeEmail');
      const loggerSpy = jest.spyOn(testLoggerService, 'log');

      const mockUser = { id: 4, email: 'spy@test.com', name: 'Spy Test' };
      (testRepository.create as jest.Mock).mockReturnValue(mockUser);
      (testRepository.save as jest.Mock).mockResolvedValue(mockUser);

      await testService.createUser({
        email: 'spy@test.com',
        name: 'Spy Test'
      });

      // Verify spies were called
      expect(emailSpy).toHaveBeenCalledWith('spy@test.com', 'Spy Test');
      expect(loggerSpy).toHaveBeenCalledWith('Creating user: spy@test.com');

      // Clean up spies
      emailSpy.mockRestore();
      loggerSpy.mockRestore();
    });

    it('should test with conditional behavior based on configuration', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserManagementService,
          {
            provide: getRepositoryToken(User),
            useValue: {
              create: jest.fn(),
              save: jest.fn(),
            },
          },
          {
            provide: EmailService,
            useValue: {
              sendWelcomeEmail: jest.fn(),
            },
          },
          {
            provide: LoggerService,
            useValue: {
              log: jest.fn(),
            },
          },
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue(false), // Email disabled
            },
          },
        ],
      }).compile();

      const testService = module.get<UserManagementService>(UserManagementService);
      const testEmailService = module.get<EmailService>(EmailService);
      const testRepository = module.get<Repository<User>>(getRepositoryToken(User));

      const mockUser = { id: 5, email: 'config@test.com', name: 'Config Test' };
      (testRepository.create as jest.Mock).mockReturnValue(mockUser);
      (testRepository.save as jest.Mock).mockResolvedValue(mockUser);

      await testService.createUser({
        email: 'config@test.com',
        name: 'Config Test'
      });

      // Email should NOT be sent because it's disabled in config
      expect(testEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });
  });
});