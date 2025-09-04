import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../nestjs/app.module';

describe('Security Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same global settings as in main.ts
    app.setGlobalPrefix('api');
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/security/headers (GET)', () => {
    it('should return security headers information', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/security/headers')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('headers');
      expect(response.body).toHaveProperty('requestHeaders');
      expect(response.body.message).toBe('Check the response headers for security improvements');
      expect(response.body.headers).toHaveProperty('Content-Security-Policy');
      expect(response.body.headers).toHaveProperty('X-Frame-Options');
      expect(response.body.headers).toHaveProperty('X-Content-Type-Options');
    });

    it('should include security headers in response', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/security/headers')
        .expect(200);

      // Check that security headers are actually set in the HTTP response
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['api-version']).toBe('1.0');
    });

    it('should handle request headers correctly', async () => {
      const customHeaders = {
        'user-agent': 'test-browser/1.0',
        'accept': 'application/json',
        'custom-header': 'test-value'
      };

      const response = await request(app.getHttpServer())
        .get('/api/security/headers')
        .set(customHeaders)
        .expect(200);

      expect(response.body.requestHeaders).toMatchObject({
        'user-agent': 'test-browser/1.0',
        'accept': 'application/json',
        'custom-header': 'test-value'
      });
    });
  });

  describe('/api/security/rate-limit-test (GET)', () => {
    it('should return rate limit information', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/security/rate-limit-test')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('tip');
      expect(response.body.message).toBe('This endpoint is protected by rate limiting (100 requests per 15 minutes)');
      
      // Verify timestamp is a valid date string
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should include security headers and response metadata', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/security/rate-limit-test')
        .expect(200);

      // Security headers should be present from our middleware
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('api-version', '1.0');
      
      // Request ID should be assigned
      expect(response.headers).toHaveProperty('x-request-id');
      expect(response.headers['x-request-id']).toMatch(/^[a-f0-9]{8}$/);
    });
  });

  describe('/api/security/environment-check (GET)', () => {
    it('should return environment security information', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/security/environment-check')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('securityNotes');
      expect(response.body).toHaveProperty('exposedEnvVars');
      expect(response.body.message).toBe('Environment security check');
      
      // Should expose safe environment variables
      expect(response.body.exposedEnvVars).toHaveProperty('NODE_ENV');
      expect(response.body.exposedEnvVars).toHaveProperty('PORT');
      
      // Should NOT expose sensitive variables
      expect(response.body.exposedEnvVars).not.toHaveProperty('JWT_SECRET');
      expect(response.body.exposedEnvVars).not.toHaveProperty('ENCRYPTION_KEY');
    });
  });
});