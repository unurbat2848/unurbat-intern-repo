import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../nestjs/app.module';

describe('Users Controller - Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same global settings as in main.ts
    app.setGlobalPrefix('api');
    
    // Enable global validation pipe to test request validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/users (POST)', () => {
    it('should create a user with valid data', async () => {
      const createUserDto = {
        email: 'valid@example.com',
        name: 'Valid User',
        age: 25
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('email', createUserDto.email);
      expect(response.body).toHaveProperty('name', createUserDto.name);
      expect(response.body).toHaveProperty('age', createUserDto.age);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should create a user with minimal required data', async () => {
      const createUserDto = {
        email: 'minimal@example.com',
        name: 'Minimal User'
        // age is optional
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body.age).toBeNull();
    });

    it('should reject invalid email format', async () => {
      const invalidUserDto = {
        email: 'not-an-email',
        name: 'Test User'
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message.some((msg: string) => msg.includes('email'))).toBe(true);
    });

    it('should reject missing email', async () => {
      const invalidUserDto = {
        name: 'Test User'
        // missing email
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => msg.includes('email'))).toBe(true);
    });

    it('should reject empty string for name', async () => {
      const invalidUserDto = {
        email: 'test@example.com',
        name: ''  // empty string
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => msg.includes('name'))).toBe(true);
    });

    it('should reject missing name', async () => {
      const invalidUserDto = {
        email: 'test@example.com'
        // missing name
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => msg.includes('name'))).toBe(true);
    });

    it('should reject invalid data type for age', async () => {
      const invalidUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 'twenty-five'  // string instead of number
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => msg.includes('age'))).toBe(true);
    });

    it('should reject extra properties not in DTO', async () => {
      const invalidUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        extraProperty: 'should be rejected',
        anotherExtra: 123
      };

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => 
        msg.includes('property') && msg.includes('should not exist')
      )).toBe(true);
    });
  });

  describe('/api/security/validate-input (POST)', () => {
    it('should validate input data with proper validation', async () => {
      const validInput = {
        name: 'Valid Name',
        email: 'valid@example.com'
      };

      const response = await request(app.getHttpServer())
        .post('/api/security/validate-input')
        .send(validInput)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Input validation successful!');
      expect(response.body).toHaveProperty('validatedData');
      expect(response.body.validatedData).toHaveProperty('name', validInput.name);
      expect(response.body.validatedData).toHaveProperty('email', validInput.email);
      expect(response.body).toHaveProperty('securityNotes');
    });

    it('should reject invalid email in validation endpoint', async () => {
      const invalidInput = {
        name: 'Valid Name',
        email: 'invalid-email'
      };

      const response = await request(app.getHttpServer())
        .post('/api/security/validate-input')
        .send(invalidInput)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => msg.includes('email'))).toBe(true);
    });

    it('should reject empty name in validation endpoint', async () => {
      const invalidInput = {
        name: '',  // empty string should be rejected
        email: 'valid@example.com'
      };

      const response = await request(app.getHttpServer())
        .post('/api/security/validate-input')
        .send(invalidInput)
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body.message.some((msg: string) => msg.includes('name'))).toBe(true);
    });

    it('should handle XSS prevention in validation', async () => {
      const potentiallyDangerousInput = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com'
      };

      const response = await request(app.getHttpServer())
        .post('/api/security/validate-input')
        .send(potentiallyDangerousInput)
        .expect(200);

      // The controller should handle the input safely
      expect(response.body.validatedData.name).toBe('<script>alert("xss")</script>');
      expect(response.body.securityNotes).toContain('sanitization');
    });
  });
});