import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = await module.resolve<EmailService>(EmailService);
  });

  afterEach(() => {
    // Clear any console.log spies
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendWelcomeEmail', () => {
    it('should send a welcome email and return message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = service.sendWelcomeEmail('john@example.com', 'John');
      
      expect(result).toBe('Welcome John! Email sent to john@example.com');
      expect(consoleSpy).toHaveBeenCalledWith('Welcome John! Email sent to john@example.com');
    });

    it('should add welcome email to history', () => {
      service.sendWelcomeEmail('jane@example.com', 'Jane');
      
      const history = service.getEmailHistory();
      expect(history).toContain('Welcome Jane! Email sent to jane@example.com');
      expect(history).toHaveLength(1);
    });

    it('should handle different email formats correctly', () => {
      const result1 = service.sendWelcomeEmail('test.email+tag@domain.co.uk', 'Test User');
      const result2 = service.sendWelcomeEmail('simple@test.com', 'Simple');
      
      expect(result1).toContain('test.email+tag@domain.co.uk');
      expect(result2).toContain('simple@test.com');
      
      const history = service.getEmailHistory();
      expect(history).toHaveLength(2);
    });

    it('should handle special characters in names', () => {
      const result = service.sendWelcomeEmail('user@test.com', "O'Brien");
      
      expect(result).toBe("Welcome O'Brien! Email sent to user@test.com");
    });
  });

  describe('sendNotification', () => {
    it('should send notification email and return formatted message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const result = service.sendNotification('admin@company.com', 'System maintenance scheduled');
      
      expect(result).toBe('Notification to admin@company.com: System maintenance scheduled');
      expect(consoleSpy).toHaveBeenCalledWith('Notification to admin@company.com: System maintenance scheduled');
    });

    it('should add notification to email history', () => {
      service.sendNotification('user@test.com', 'Your order is ready');
      
      const history = service.getEmailHistory();
      expect(history).toContain('Notification to user@test.com: Your order is ready');
    });

    it('should handle empty message', () => {
      const result = service.sendNotification('test@example.com', '');
      
      expect(result).toBe('Notification to test@example.com: ');
    });

    it('should handle long notification messages', () => {
      const longMessage = 'This is a very long notification message that contains a lot of text to test how the service handles lengthy content without any issues or truncation problems.';
      
      const result = service.sendNotification('test@example.com', longMessage);
      
      expect(result).toContain(longMessage);
      expect(result).toContain('test@example.com');
    });
  });

  describe('getEmailHistory', () => {
    it('should return empty array initially', () => {
      const history = service.getEmailHistory();
      
      expect(history).toEqual([]);
      expect(Array.isArray(history)).toBe(true);
    });

    it('should return all sent emails in order', () => {
      service.sendWelcomeEmail('first@test.com', 'First User');
      service.sendNotification('second@test.com', 'Test notification');
      service.sendWelcomeEmail('third@test.com', 'Third User');
      
      const history = service.getEmailHistory();
      
      expect(history).toHaveLength(3);
      expect(history[0]).toContain('Welcome First User');
      expect(history[1]).toContain('Notification to second@test.com');
      expect(history[2]).toContain('Welcome Third User');
    });

    it('should maintain history throughout service lifecycle', () => {
      // Send multiple emails
      service.sendWelcomeEmail('user1@test.com', 'User One');
      service.sendNotification('user2@test.com', 'Alert message');
      
      // Check history multiple times
      const history1 = service.getEmailHistory();
      const history2 = service.getEmailHistory();
      
      expect(history1).toEqual(history2);
      expect(history1).toHaveLength(2);
    });
  });

  describe('integration tests', () => {
    it('should track all email types in single history', () => {
      // Mix of welcome emails and notifications
      service.sendWelcomeEmail('welcome@test.com', 'Welcome User');
      service.sendNotification('notify@test.com', 'Important update');
      service.sendWelcomeEmail('another@test.com', 'Another User');
      service.sendNotification('alert@test.com', 'System alert');
      
      const history = service.getEmailHistory();
      
      expect(history).toHaveLength(4);
      expect(history.filter(email => email.includes('Welcome'))).toHaveLength(2);
      expect(history.filter(email => email.includes('Notification'))).toHaveLength(2);
    });

    it('should handle rapid succession of emails', () => {
      const emails = [];
      for (let i = 0; i < 10; i++) {
        emails.push(service.sendWelcomeEmail(`user${i}@test.com`, `User ${i}`));
      }
      
      const history = service.getEmailHistory();
      expect(history).toHaveLength(10);
      expect(emails).toHaveLength(10);
    });
  });

  describe('edge cases', () => {
    it('should handle null or undefined parameters gracefully', () => {
      // These would normally cause runtime errors, but we test the current behavior
      expect(() => {
        service.sendWelcomeEmail(null as any, 'Name');
      }).not.toThrow();
      
      expect(() => {
        service.sendWelcomeEmail('email@test.com', null as any);
      }).not.toThrow();
    });

    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      const result = service.sendWelcomeEmail(longEmail, 'Test');
      
      expect(result).toContain(longEmail);
    });
  });
});