import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = await module.resolve<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should create service with unique instance ID', () => {
      const service1 = new LoggerService();
      const service2 = new LoggerService();
      
      expect(service1.getInstanceId()).not.toBe(service2.getInstanceId());
      expect(service1.getInstanceId()).toBeTruthy();
      expect(service2.getInstanceId()).toBeTruthy();
    });

    it('should log instance creation', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const newService = new LoggerService();
      const instanceId = newService.getInstanceId();
      
      expect(consoleSpy).toHaveBeenCalledWith(`Logger instance created: ${instanceId}`);
    });
  });

  describe('getInstanceId', () => {
    it('should return a string', () => {
      const instanceId = service.getInstanceId();
      
      expect(typeof instanceId).toBe('string');
      expect(instanceId.length).toBeGreaterThan(0);
    });

    it('should return same ID for same instance', () => {
      const id1 = service.getInstanceId();
      const id2 = service.getInstanceId();
      
      expect(id1).toBe(id2);
    });

    it('should generate alphanumeric IDs', () => {
      const instanceId = service.getInstanceId();
      
      // Should only contain alphanumeric characters
      expect(instanceId).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('log', () => {
    it('should log message with instance ID and timestamp', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const instanceId = service.getInstanceId();
      
      service.log('Test message');
      
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain(instanceId);
      expect(logCall).toContain('Test message');
      expect(logCall).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO timestamp pattern
    });

    it('should log different messages with same instance ID', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const instanceId = service.getInstanceId();
      
      service.log('First message');
      service.log('Second message');
      
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      
      const firstLog = consoleSpy.mock.calls[0][0];
      const secondLog = consoleSpy.mock.calls[1][0];
      
      expect(firstLog).toContain(instanceId);
      expect(firstLog).toContain('First message');
      expect(secondLog).toContain(instanceId);
      expect(secondLog).toContain('Second message');
    });

    it('should handle empty message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const instanceId = service.getInstanceId();
      
      service.log('');
      
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain(instanceId);
      expect(logCall).toContain(''); // Empty message should still be in log
    });

    it('should handle special characters in message', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const specialMessage = 'Test with émojis 🚀 and symbols @#$%';
      
      service.log(specialMessage);
      
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain(specialMessage);
    });

    it('should handle very long messages', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const longMessage = 'A'.repeat(1000);
      
      service.log(longMessage);
      
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain(longMessage);
    });
  });

  describe('TRANSIENT scope behavior simulation', () => {
    it('should demonstrate different instances have different IDs', async () => {
      // Create multiple instances to simulate TRANSIENT scope
      const module1: TestingModule = await Test.createTestingModule({
        providers: [LoggerService],
      }).compile();
      
      const module2: TestingModule = await Test.createTestingModule({
        providers: [LoggerService],
      }).compile();

      const service1 = module1.get<LoggerService>(LoggerService);
      const service2 = module2.get<LoggerService>(LoggerService);
      
      expect(service1.getInstanceId()).not.toBe(service2.getInstanceId());
    });

    it('should show logs from different instances are distinguishable', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const service1 = new LoggerService();
      const service2 = new LoggerService();
      
      service1.log('From service 1');
      service2.log('From service 2');
      
      const log1 = consoleSpy.mock.calls.find(call => call[0].includes('From service 1'))[0];
      const log2 = consoleSpy.mock.calls.find(call => call[0].includes('From service 2'))[0];
      
      // Extract instance IDs from logs
      const id1Match = log1.match(/\[([^\]]+)\]/);
      const id2Match = log2.match(/\[([^\]]+)\]/);
      
      expect(id1Match[1]).not.toBe(id2Match[1]);
    });
  });

  describe('timestamp accuracy', () => {
    it('should log with recent timestamp', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const beforeLog = new Date();
      
      service.log('Timestamp test');
      
      const afterLog = new Date();
      const logCall = consoleSpy.mock.calls[0][0];
      
      // Extract timestamp from log
      const timestampMatch = logCall.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/);
      expect(timestampMatch).not.toBeNull();
      
      const loggedTime = new Date(timestampMatch[1]);
      expect(loggedTime.getTime()).toBeGreaterThanOrEqual(beforeLog.getTime());
      expect(loggedTime.getTime()).toBeLessThanOrEqual(afterLog.getTime());
    });
  });
});