import { Test, TestingModule } from '@nestjs/testing';
import { SecurityController } from './security.controller';

describe('SecurityController', () => {
  let controller: SecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
    }).compile();

    controller = module.get<SecurityController>(SecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // WEAK TEST - just calls the method but doesn't verify behavior
  it('should have checkSecurityHeaders method', () => {
    const mockRequest = { headers: {} } as any;
    const result = controller.checkSecurityHeaders(mockRequest);
    expect(result).toBeDefined(); // This is a weak assertion!
  });

  // BETTER TEST - verifies actual behavior and response structure
  describe('checkSecurityHeaders', () => {
    it('should return security headers information', () => {
      const mockRequest = {
        headers: {
          'user-agent': 'test-browser',
          'accept': 'application/json'
        }
      } as any;

      const result = controller.checkSecurityHeaders(mockRequest);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('headers');
      expect(result).toHaveProperty('requestHeaders');
      expect(result.message).toBe('Check the response headers for security improvements');
      expect(result.headers).toHaveProperty('Content-Security-Policy');
      expect(result.requestHeaders).toEqual(mockRequest.headers);
    });
  });

  describe('testRateLimit', () => {
    it('should return rate limit information', () => {
      const result = controller.testRateLimit();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('tip');
      expect(result.message).toBe('This endpoint is protected by rate limiting (100 requests per 15 minutes)');
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('checkEnvironmentSecurity', () => {
    it('should return environment security information', () => {
      const result = controller.checkEnvironmentSecurity();

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('securityNotes');
      expect(result).toHaveProperty('exposedEnvVars');
      expect(result.message).toBe('Environment security check');
      expect(result.exposedEnvVars).toHaveProperty('NODE_ENV');
      expect(result.exposedEnvVars).toHaveProperty('PORT');
    });
  });
});