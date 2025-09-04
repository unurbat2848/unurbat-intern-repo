import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../nestjs/app.module';

describe('Encryption Test Controller (e2e)', () => {
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

  describe('/api/encryption-test/create-user (POST)', () => {
    it('should create a user with encrypted sensitive data', async () => {
      const createUserDto = {
        email: `test-${Date.now()}@example.com`, // Use unique email to avoid duplicates
        name: 'Test User',
        phoneNumber: '555-123-4567',
        socialSecurityNumber: '123-45-6789',
        age: 25
      };

      const response = await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created with encrypted sensitive data');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('note', 'phoneNumber and socialSecurityNumber are encrypted in the database');
      
      // The response should contain the decrypted data
      expect(response.body.user).toHaveProperty('email', createUserDto.email);
      expect(response.body.user).toHaveProperty('name', createUserDto.name);
      expect(response.body.user).toHaveProperty('phoneNumber', createUserDto.phoneNumber);
      expect(response.body.user).toHaveProperty('socialSecurityNumber', createUserDto.socialSecurityNumber);
      expect(response.body.user).toHaveProperty('age', createUserDto.age);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('createdAt');
      expect(response.body.user).toHaveProperty('updatedAt');
    });

    it('should create a user with minimal required data', async () => {
      const createUserDto = {
        email: `minimal-${Date.now()}@example.com`,
        name: 'Minimal User'
      };

      const response = await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send(createUserDto)
        .expect(201);

      expect(response.body.user).toHaveProperty('email', createUserDto.email);
      expect(response.body.user).toHaveProperty('name', createUserDto.name);
      expect(response.body.user.phoneNumber).toBeNull();
      expect(response.body.user.socialSecurityNumber).toBeNull();
      expect(response.body.user.age).toBeNull();
    });

    // Note: The encryption-test controller uses inline interface without validation decorators,
    // so it accepts any data. For proper validation testing, we need to test a controller with DTOs.
    it('should accept any data since no validation is configured on this endpoint', async () => {
      const invalidUserDto = {
        email: 'not-an-email',  // Would normally be rejected by email validation
        name: '',               // Would normally be rejected by string validation
        extraProperty: 'should be accepted without validation'
      };

      const response = await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send(invalidUserDto)
        .expect(201);  // This endpoint doesn't validate, so it succeeds

      expect(response.body).toHaveProperty('message', 'User created with encrypted sensitive data');
      expect(response.body.user.email).toBe('not-an-email');
      expect(response.body.user.name).toBe('');
    });

    it('should handle completely empty request body', async () => {
      // Without validation, this might cause database constraint errors
      const response = await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send({})
        .expect(500); // Likely to fail due to database constraints

      expect(response.body).toHaveProperty('statusCode', 500);
      expect(response.body).toHaveProperty('message', 'Internal server error');
    });
  });

  describe('/api/encryption-test/users (GET)', () => {
    beforeAll(async () => {
      // Create some test data
      await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send({
          email: 'listtest1@example.com',
          name: 'List Test User 1',
          phoneNumber: '555-001-0001'
        });

      await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send({
          email: 'listtest2@example.com',
          name: 'List Test User 2',
          socialSecurityNumber: '000-00-0002'
        });
    });

    it('should retrieve all users with decrypted data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/encryption-test/users')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Retrieved users with decrypted sensitive data');
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('note');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);

      // Check that users have proper structure and decrypted data
      const user = response.body.users[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });
  });

  describe('/api/encryption-test/user/:id (GET)', () => {
    let userId: number;

    beforeAll(async () => {
      // Create a test user to retrieve
      const response = await request(app.getHttpServer())
        .post('/api/encryption-test/create-user')
        .send({
          email: 'gettest@example.com',
          name: 'Get Test User',
          phoneNumber: '555-GET-TEST',
          socialSecurityNumber: '123-GET-TEST'
        });
      
      userId = response.body.user.id;
    });

    it('should retrieve a specific user with decrypted data', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/encryption-test/user/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User retrieved with decrypted data');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('encryption');
      
      expect(response.body.user).toHaveProperty('id', userId);
      expect(response.body.user).toHaveProperty('email', 'gettest@example.com');
      expect(response.body.user).toHaveProperty('name', 'Get Test User');
      expect(response.body.user).toHaveProperty('phoneNumber', '555-GET-TEST');
      expect(response.body.user).toHaveProperty('socialSecurityNumber', '123-GET-TEST');

      // Check encryption status
      expect(response.body.encryption).toHaveProperty('phoneNumber', 'Decrypted successfully');
      expect(response.body.encryption).toHaveProperty('socialSecurityNumber', 'Decrypted successfully');
    });

    it('should return user not found message for non-existent user', async () => {
      const nonExistentId = 99999;
      
      const response = await request(app.getHttpServer())
        .get(`/api/encryption-test/user/${nonExistentId}`)
        .expect(200); // Controller returns 200 with error message instead of 404

      expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should handle invalid ID parameter (non-numeric)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/encryption-test/user/abc')
        .expect(500); // TypeORM throws error when trying to convert 'abc' to number

      expect(response.body).toHaveProperty('statusCode', 500);
      expect(response.body).toHaveProperty('message', 'Internal server error');
    });
  });
});