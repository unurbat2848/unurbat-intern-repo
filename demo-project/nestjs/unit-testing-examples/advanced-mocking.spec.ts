import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email.service';
import { LoggerService } from '../logger.service';

// Mock external modules using jest.mock()
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
}));

import * as fs from 'fs';

// Example service that depends on multiple services
export class NotificationService {
  constructor(
    private emailService: EmailService,
    private loggerService: LoggerService,
    private configService: ConfigService,
  ) {}

  async sendWelcomeNotification(email: string, name: string) {
    const isEmailEnabled = this.configService.get<boolean>('email.enabled', true);
    
    if (!isEmailEnabled) {
      this.loggerService.log('Email notifications are disabled');
      return { sent: false, reason: 'Email disabled' };
    }

    try {
      const result = this.emailService.sendWelcomeEmail(email, name);
      this.loggerService.log(`Welcome email sent to ${email}`);
      
      // Save notification to file (mock file system operation)
      const notification = {
        email,
        name,
        type: 'welcome',
        timestamp: new Date(),
        result,
      };
      
      fs.writeFileSync(`notifications/${email}.json`, JSON.stringify(notification));
      
      return { sent: true, message: result };
    } catch (error) {
      this.loggerService.log(`Failed to send email to ${email}: ${error.message}`);
      return { sent: false, error: error.message };
    }
  }

  getNotificationHistory(email: string) {
    try {
      if (!fs.existsSync(`notifications/${email}.json`)) {
        return null;
      }
      
      const data = fs.readFileSync(`notifications/${email}.json`, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.loggerService.log(`Error reading notification history: ${error.message}`);
      return null;
    }
  }
}

describe('Advanced Mocking Examples', () => {
  let notificationService: NotificationService;
  let emailService: EmailService;
  let loggerService: LoggerService;
  let configService: ConfigService;

  // Different types of mocks
  const mockEmailService = {
    sendWelcomeEmail: jest.fn(),
    sendNotification: jest.fn(),
    getEmailHistory: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    getInstanceId: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    emailService = module.get<EmailService>(EmailService);
    loggerService = module.get<LoggerService>(LoggerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Mocking with NestJS Testing Module', () => {
    it('should successfully inject mocked dependencies', () => {
      expect(notificationService).toBeDefined();
      expect(emailService).toBeDefined();
      expect(loggerService).toBeDefined();
      expect(configService).toBeDefined();
    });

    it('should use mocked service methods', async () => {
      // Setup mocks
      mockConfigService.get.mockReturnValue(true);
      mockEmailService.sendWelcomeEmail.mockReturnValue('Email sent successfully');
      mockLoggerService.getInstanceId.mockReturnValue('test-instance-123');

      const result = await notificationService.sendWelcomeNotification(
        'test@example.com',
        'Test User'
      );

      expect(mockConfigService.get).toHaveBeenCalledWith('email.enabled', true);
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com', 'Test User');
      expect(mockLoggerService.log).toHaveBeenCalledWith('Welcome email sent to test@example.com');
    });
  });

  describe('Mocking External Modules with jest.mock()', () => {
    it('should mock file system operations', async () => {
      // Setup mocks
      mockConfigService.get.mockReturnValue(true);
      mockEmailService.sendWelcomeEmail.mockReturnValue('Welcome message');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      const result = await notificationService.sendWelcomeNotification(
        'user@test.com',
        'John Doe'
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'notifications/user@test.com.json',
        expect.stringContaining('"email":"user@test.com"')
      );
      expect(result.sent).toBe(true);
    });

    it('should mock file reading operations', () => {
      const mockNotificationData = {
        email: 'test@example.com',
        name: 'Test User',
        type: 'welcome',
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockNotificationData));

      const result = notificationService.getNotificationHistory('test@example.com');

      expect(fs.existsSync).toHaveBeenCalledWith('notifications/test@example.com.json');
      expect(fs.readFileSync).toHaveBeenCalledWith('notifications/test@example.com.json', 'utf8');
      expect(result).toEqual(mockNotificationData);
    });

    it('should handle file system errors gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File read error');
      });

      const result = notificationService.getNotificationHistory('error@test.com');

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Error reading notification history: File read error'
      );
      expect(result).toBeNull();
    });
  });

  describe('Advanced Mock Configurations', () => {
    it('should use different return values for different calls', async () => {
      mockConfigService.get
        .mockReturnValueOnce(true)   // First call - email enabled
        .mockReturnValueOnce(false)  // Second call - email disabled
        .mockReturnValue(true);      // Default for other calls

      // First call should send email
      const result1 = await notificationService.sendWelcomeNotification('user1@test.com', 'User 1');
      expect(result1.sent).toBe(true);

      // Second call should skip email
      const result2 = await notificationService.sendWelcomeNotification('user2@test.com', 'User 2');
      expect(result2.sent).toBe(false);
      expect(result2.reason).toBe('Email disabled');
    });

    it('should mock resolved promises', async () => {
      const asyncEmailService = {
        sendWelcomeEmail: jest.fn().mockResolvedValue('Async email sent'),
        sendNotification: jest.fn().mockRejectedValue(new Error('Async error')),
      };

      // Create a new instance for this test
      const testModule = await Test.createTestingModule({
        providers: [
          NotificationService,
          { provide: EmailService, useValue: asyncEmailService },
          { provide: LoggerService, useValue: mockLoggerService },
          { provide: ConfigService, useValue: mockConfigService },
        ],
      }).compile();

      const testNotificationService = testModule.get<NotificationService>(NotificationService);
      mockConfigService.get.mockReturnValue(true);

      // Test resolved promise
      const result = await testNotificationService.sendWelcomeNotification('async@test.com', 'Async User');
      expect(asyncEmailService.sendWelcomeEmail).toHaveBeenCalled();
    });

    it('should spy on mock implementations', async () => {
      const emailSpy = jest.spyOn(mockEmailService, 'sendWelcomeEmail')
        .mockImplementation((email: string, name: string) => {
          return `Custom implementation for ${name}`;
        });

      mockConfigService.get.mockReturnValue(true);

      await notificationService.sendWelcomeNotification('spy@test.com', 'Spy User');

      expect(emailSpy).toHaveBeenCalledWith('spy@test.com', 'Spy User');
      expect(emailSpy).toHaveReturnedWith('Custom implementation for Spy User');
    });
  });

  describe('Mock Verification and Assertions', () => {
    it('should verify exact call parameters', async () => {
      mockConfigService.get.mockReturnValue(true);
      mockEmailService.sendWelcomeEmail.mockReturnValue('Test email');

      await notificationService.sendWelcomeNotification('verify@test.com', 'Verify User');

      // Exact parameter matching
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('verify@test.com', 'Verify User');
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalledWith('wrong@test.com', 'Verify User');
    });

    it('should verify call order and frequency', async () => {
      mockConfigService.get.mockReturnValue(true);
      mockEmailService.sendWelcomeEmail.mockReturnValue('Email sent');

      await notificationService.sendWelcomeNotification('order@test.com', 'Order User');

      // Verify call order
      expect(mockConfigService.get).toHaveBeenNthCalledWith(1, 'email.enabled', true);
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenNthCalledWith(1, 'order@test.com', 'Order User');
      expect(mockLoggerService.log).toHaveBeenNthCalledWith(1, 'Welcome email sent to order@test.com');

      // Verify call count
      expect(mockConfigService.get).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
      expect(mockLoggerService.log).toHaveBeenCalledTimes(1);
    });

    it('should verify mock interactions with matchers', async () => {
      mockConfigService.get.mockReturnValue(true);
      mockEmailService.sendWelcomeEmail.mockReturnValue('Matcher test');

      await notificationService.sendWelcomeNotification('matcher@test.com', 'Matcher User');

      // Using Jest matchers
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        expect.stringContaining('@'),
        expect.stringMatching(/^[A-Z]/)
      );

      expect(mockLoggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('matcher@test.com')
      );
    });
  });

  describe('Error Handling with Mocks', () => {
    it('should handle service errors properly', async () => {
      mockConfigService.get.mockReturnValue(true);
      mockEmailService.sendWelcomeEmail.mockImplementation(() => {
        throw new Error('Email service unavailable');
      });

      const result = await notificationService.sendWelcomeNotification('error@test.com', 'Error User');

      expect(result.sent).toBe(false);
      expect(result.error).toBe('Email service unavailable');
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        'Failed to send email to error@test.com: Email service unavailable'
      );
    });

    it('should test different error scenarios', async () => {
      const errorScenarios = [
        { error: new Error('Network timeout'), expectedLog: 'Network timeout' },
        { error: new Error('Invalid email format'), expectedLog: 'Invalid email format' },
        { error: new Error('Service unavailable'), expectedLog: 'Service unavailable' },
      ];

      for (const scenario of errorScenarios) {
        jest.clearAllMocks();
        mockConfigService.get.mockReturnValue(true);
        mockEmailService.sendWelcomeEmail.mockImplementation(() => {
          throw scenario.error;
        });

        const result = await notificationService.sendWelcomeNotification('test@error.com', 'Test');

        expect(result.sent).toBe(false);
        expect(mockLoggerService.log).toHaveBeenCalledWith(
          expect.stringContaining(scenario.expectedLog)
        );
      }
    });
  });
});