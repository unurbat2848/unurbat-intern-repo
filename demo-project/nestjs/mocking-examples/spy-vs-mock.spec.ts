import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products/products.service';

describe('jest.spyOn() vs jest.fn() Examples', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  describe('jest.spyOn() - Spying on existing methods', () => {
    it('should spy on getAllProducts and call original method', () => {
      // Create a spy that calls the original method
      const getAllProductsSpy = jest.spyOn(service, 'getAllProducts');

      const result = service.getAllProducts();

      expect(getAllProductsSpy).toHaveBeenCalled();
      expect(result).toHaveLength(3); // Original method returns 3 products
      expect(result[0].name).toBe('Laptop'); // Original data
    });

    it('should spy on getAllProducts and mock its return value', () => {
      const mockProducts = [
        { id: 99, name: 'Mocked Product', price: 999, description: 'This is mocked' }
      ];

      // Create a spy and mock its return value
      const getAllProductsSpy = jest.spyOn(service, 'getAllProducts').mockReturnValue(mockProducts);

      const result = service.getAllProducts();

      expect(getAllProductsSpy).toHaveBeenCalled();
      expect(result).toBe(mockProducts); // Returns mocked data
      expect(result).toHaveLength(1); // Mocked data has 1 item
    });

    it('should spy on createProduct and track calls while using original logic', () => {
      const createProductSpy = jest.spyOn(service, 'createProduct');
      const productData = { name: 'Spied Product', price: 250, description: 'Created via spy' };

      const result = service.createProduct(productData);

      expect(createProductSpy).toHaveBeenCalledWith(productData);
      expect(createProductSpy).toHaveBeenCalledTimes(1);
      expect(result).toHaveProperty('id'); // Original method assigns ID
      expect(result.name).toBe(productData.name);
    });

    it('should spy on deleteProduct and mock implementation', () => {
      // Spy and provide custom implementation
      const deleteProductSpy = jest.spyOn(service, 'deleteProduct')
        .mockImplementation((id: number) => {
          console.log(`Mocked deletion of product ${id}`);
          return id === 1; // Custom logic: only succeed for ID 1
        });

      const result1 = service.deleteProduct(1);
      const result2 = service.deleteProduct(2);

      expect(deleteProductSpy).toHaveBeenCalledTimes(2);
      expect(result1).toBe(true);  // Our custom logic
      expect(result2).toBe(false); // Our custom logic
    });
  });

  describe('jest.fn() - Creating mock functions from scratch', () => {
    it('should create a completely mocked service using jest.fn()', () => {
      // Create a completely mocked service object
      const mockService = {
        getAllProducts: jest.fn().mockReturnValue([
          { id: 1, name: 'Mock Product 1', price: 100, description: 'Mocked' }
        ]),
        getProductById: jest.fn().mockReturnValue(undefined),
        createProduct: jest.fn().mockReturnValue({
          id: 999,
          name: 'Created Product',
          price: 200,
          description: 'Created by mock'
        }),
        updateProduct: jest.fn(),
        deleteProduct: jest.fn().mockReturnValue(true)
      };

      // Use the mock service
      const products = mockService.getAllProducts();
      const newProduct = mockService.createProduct({ name: 'Test', price: 100, description: 'Test' });

      expect(mockService.getAllProducts).toHaveBeenCalled();
      expect(mockService.createProduct).toHaveBeenCalledWith({ name: 'Test', price: 100, description: 'Test' });
      expect(products[0].name).toBe('Mock Product 1');
      expect(newProduct.id).toBe(999);
    });

    it('should use jest.fn() for callback testing', () => {
      // Create a mock callback function
      const mockCallback = jest.fn();
      
      // Function that uses callbacks (simulated)
      const processProducts = (callback: (product: any) => void) => {
        const products = service.getAllProducts();
        products.forEach(callback);
      };

      processProducts(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(3); // Called for each product
      // Check that the callback was called with the right product objects
      expect(mockCallback.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          description: expect.any(String)
        })
      );
    });

    it('should use jest.fn() with different return values per call', () => {
      const mockFunction = jest.fn()
        .mockReturnValueOnce('first call')
        .mockReturnValueOnce('second call')
        .mockReturnValue('default return');

      expect(mockFunction()).toBe('first call');
      expect(mockFunction()).toBe('second call');
      expect(mockFunction()).toBe('default return');
      expect(mockFunction()).toBe('default return'); // Uses default for subsequent calls
    });
  });

  describe('When to use jest.spyOn() vs jest.fn()', () => {
    it('Use jest.spyOn() when you want to monitor existing methods', () => {
      // When you have a real object and want to track method calls
      // while optionally modifying behavior
      const spy = jest.spyOn(service, 'getProductById');
      
      service.getProductById(1);
      service.getProductById(2);

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 1);
      expect(spy).toHaveBeenNthCalledWith(2, 2);
      
      // Can still check that real method was called with real results
      expect(service.getProductById(1)).toEqual(
        expect.objectContaining({ id: 1, name: 'Laptop' })
      );
    });

    it('Use jest.fn() when creating mocks from scratch', () => {
      // When you don't have a real implementation or want complete control
      const mockApiCall = jest.fn().mockResolvedValue({ success: true });
      
      // Simulate using the mock in a function
      const useApi = async (apiFunction: Function) => {
        return await apiFunction();
      };

      // Test the mock
      useApi(mockApiCall).then(result => {
        expect(mockApiCall).toHaveBeenCalled();
        expect(result).toEqual({ success: true });
      });
    });
  });
});