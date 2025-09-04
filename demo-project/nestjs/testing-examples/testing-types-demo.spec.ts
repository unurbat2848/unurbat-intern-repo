import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsService } from '../products/products.service';
import { ProductsController } from '../products/products.controller';
import { EmailService } from '../email.service';

/**
 * UNIT TESTING EXAMPLE
 * 
 * Unit tests focus on testing individual components (services, controllers) in isolation
 * They use mocks to replace dependencies and test business logic
 */
describe('UNIT TESTING - ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('Unit Test - Business Logic', () => {
    it('should add a new product and assign correct ID', () => {
      const initialProducts = service.getAllProducts();
      const initialCount = initialProducts.length;
      
      const newProduct = service.createProduct({
        name: 'Unit Test Product',
        price: 99.99,
        description: 'Product created in unit test'
      });

      // Test business logic
      expect(newProduct).toHaveProperty('id');
      expect(newProduct.name).toBe('Unit Test Product');
      expect(newProduct.price).toBe(99.99);
      
      // Verify state change
      const updatedProducts = service.getAllProducts();
      expect(updatedProducts).toHaveLength(initialCount + 1);
    });

    it('should return undefined for non-existent product', () => {
      const product = service.getProductById(99999);
      expect(product).toBeUndefined();
    });

    it('should successfully delete existing product', () => {
      const initialCount = service.getAllProducts().length;
      
      // Create a product to delete
      const newProduct = service.createProduct({
        name: 'To Delete',
        price: 10,
        description: 'Will be deleted'
      });
      
      expect(service.getAllProducts()).toHaveLength(initialCount + 1);
      
      // Delete the product
      const deleted = service.deleteProduct(newProduct.id);
      
      expect(deleted).toBe(true);
      expect(service.getAllProducts()).toHaveLength(initialCount);
      expect(service.getProductById(newProduct.id)).toBeUndefined();
    });
  });
});

/**
 * INTEGRATION TESTING EXAMPLE
 * 
 * Integration tests focus on testing how multiple components work together
 * They test the interaction between services, controllers, and other dependencies
 */
describe('INTEGRATION TESTING - ProductsController with ProductsService', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService], // Real service, not mocked
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('Integration Test - Controller + Service', () => {
    it('should get all products through controller', () => {
      const products = controller.getAllProducts();
      const serviceProducts = service.getAllProducts();
      
      // Verify controller uses service correctly
      expect(products).toEqual(serviceProducts);
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('should create product through controller and persist in service', () => {
      const productData = {
        name: 'Integration Test Product',
        price: 199.99,
        description: 'Created via controller'
      };

      const createdProduct = controller.createProduct(productData);
      
      // Verify controller returns correct data
      expect(createdProduct).toHaveProperty('id');
      expect(createdProduct.name).toBe(productData.name);
      
      // Verify product persisted in service
      const foundProduct = service.getProductById(createdProduct.id);
      expect(foundProduct).toEqual(createdProduct);
    });

    it('should handle product not found error in controller', () => {
      expect(() => {
        controller.getProduct(99999);
      }).toThrow('Product not found');
    });
  });
});

/**
 * E2E (End-to-End) TESTING EXAMPLE
 * 
 * E2E tests simulate real user interactions by making HTTP requests
 * They test the complete application flow from HTTP request to response
 */
describe('E2E TESTING - Products API', () => {
  let app: INestApplication;
  let service: ProductsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<ProductsService>(ProductsService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('E2E Test - HTTP Requests', () => {
    it('should GET /products and return array', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify response structure
      const product = response.body[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
    });

    it('should POST /products and create new product', async () => {
      const newProduct = {
        name: 'E2E Test Product',
        price: 299.99,
        description: 'Created via E2E test'
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);

      // Verify product was actually created
      const foundProduct = service.getProductById(response.body.id);
      expect(foundProduct).toBeTruthy();
      expect(foundProduct?.name).toBe(newProduct.name);
    });

    it('should GET /products/:id with valid ID', async () => {
      // First create a product
      const newProduct = {
        name: 'Test Product for GET',
        price: 99.99,
        description: 'For testing GET by ID'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(newProduct)
        .expect(201);

      const productId = createResponse.body.id;

      // Then get the product by ID
      const getResponse = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(productId);
      expect(getResponse.body.name).toBe(newProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      await request(app.getHttpServer())
        .get('/products/99999')
        .expect(404);
    });

    it('should PUT /products/:id and update product', async () => {
      // Create a product first
      const originalProduct = {
        name: 'Original Product',
        price: 100,
        description: 'Original description'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(originalProduct)
        .expect(201);

      const productId = createResponse.body.id;

      // Update the product
      const updateData = {
        name: 'Updated Product',
        price: 150
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.name).toBe(updateData.name);
      expect(updateResponse.body.price).toBe(updateData.price);
      expect(updateResponse.body.description).toBe(originalProduct.description); // Should keep original
    });

    it('should DELETE /products/:id and remove product', async () => {
      // Create a product first
      const productToDelete = {
        name: 'Product to Delete',
        price: 50,
        description: 'Will be deleted'
      };

      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send(productToDelete)
        .expect(201);

      const productId = createResponse.body.id;

      // Delete the product
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200);

      // Verify product is gone
      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });
  });

  describe('E2E Test - Error Handling', () => {
    it('should handle validation errors for invalid product data', async () => {
      const invalidProduct = {
        // Missing required fields
        price: 'not a number',
      };

      await request(app.getHttpServer())
        .post('/products')
        .send(invalidProduct)
        .expect(400); // Bad Request due to validation
    });

    it('should handle malformed requests gracefully', async () => {
      await request(app.getHttpServer())
        .get('/products/not-a-number')
        .expect(400); // Bad Request due to invalid ID format
    });
  });
});

/**
 * COMPARISON SUMMARY
 * 
 * Unit Tests:
 * - Fast execution
 * - Test individual components
 * - Use mocks for dependencies
 * - Focus on business logic
 * 
 * Integration Tests:
 * - Medium execution speed
 * - Test component interactions
 * - Use real dependencies where possible
 * - Focus on data flow between components
 * 
 * E2E Tests:
 * - Slower execution
 * - Test complete user workflows
 * - Use real HTTP requests
 * - Focus on user-facing functionality
 */

describe('TESTING BEST PRACTICES', () => {
  describe('Test Organization', () => {
    it('should have clear and descriptive test names', () => {
      // Good: "should return 404 when product does not exist"
      // Bad: "test product endpoint"
      expect(true).toBe(true);
    });

    it('should test one thing at a time', () => {
      // Each test should verify one specific behavior
      expect(true).toBe(true);
    });

    it('should be independent and not rely on other tests', () => {
      // Tests should be able to run in any order
      expect(true).toBe(true);
    });
  });

  describe('Test Data Management', () => {
    it('should use setup and teardown for test data', () => {
      // Use beforeEach/afterEach for consistent test state
      expect(true).toBe(true);
    });

    it('should use meaningful test data', () => {
      // Use data that makes tests easy to understand
      expect(true).toBe(true);
    });
  });
});