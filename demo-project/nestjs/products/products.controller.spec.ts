import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  // Mock the ProductsService
  const mockProductsService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          // Replace the real ProductsService with our mock
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    // Clear all mocks after each test to avoid interference
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all products from service', () => {
      const mockProducts = [
        { id: 1, name: 'Test Product', price: 100, description: 'Test Description' }
      ];
      
      // Mock the service method to return our test data
      mockProductsService.getAllProducts.mockReturnValue(mockProducts);

      const result = controller.getAllProducts();

      expect(service.getAllProducts).toHaveBeenCalled();
      expect(result).toBe(mockProducts);
    });
  });

  describe('getProduct', () => {
    it('should return a product when found', () => {
      const mockProduct = { id: 1, name: 'Test Product', price: 100, description: 'Test Description' };
      
      // Mock the service to return a product
      mockProductsService.getProductById.mockReturnValue(mockProduct);

      const result = controller.getProduct(1);

      expect(service.getProductById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockProduct);
    });

    it('should throw HttpException when product not found', () => {
      // Mock the service to return undefined (product not found)
      mockProductsService.getProductById.mockReturnValue(undefined);

      expect(() => controller.getProduct(999)).toThrow(HttpException);
      expect(() => controller.getProduct(999)).toThrow('Product not found');
      expect(service.getProductById).toHaveBeenCalledWith(999);
    });
  });

  describe('createProduct', () => {
    it('should create a product', () => {
      const createProductDto = { name: 'New Product', price: 150, description: 'New Description' };
      const mockCreatedProduct = { id: 4, ...createProductDto };
      
      // Mock the service to return the created product
      mockProductsService.createProduct.mockReturnValue(mockCreatedProduct);

      const result = controller.createProduct(createProductDto);

      expect(service.createProduct).toHaveBeenCalledWith(createProductDto);
      expect(result).toBe(mockCreatedProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product when found', () => {
      const updateProductDto = { name: 'Updated Product', price: 200 };
      const mockUpdatedProduct = { id: 1, name: 'Updated Product', price: 200, description: 'Original Description' };
      
      // Mock the service to return the updated product
      mockProductsService.updateProduct.mockReturnValue(mockUpdatedProduct);

      const result = controller.updateProduct(1, updateProductDto);

      expect(service.updateProduct).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toBe(mockUpdatedProduct);
    });

    it('should throw HttpException when product not found for update', () => {
      const updateProductDto = { name: 'Updated Product' };
      
      // Mock the service to return undefined (product not found)
      mockProductsService.updateProduct.mockReturnValue(undefined);

      expect(() => controller.updateProduct(999, updateProductDto)).toThrow(HttpException);
      expect(() => controller.updateProduct(999, updateProductDto)).toThrow('Product not found');
      expect(service.updateProduct).toHaveBeenCalledWith(999, updateProductDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product when found', () => {
      // Mock the service to return true (successful deletion)
      mockProductsService.deleteProduct.mockReturnValue(true);

      const result = controller.deleteProduct(1);

      expect(service.deleteProduct).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });

    it('should throw HttpException when product not found for deletion', () => {
      // Mock the service to return false (product not found)
      mockProductsService.deleteProduct.mockReturnValue(false);

      expect(() => controller.deleteProduct(999)).toThrow(HttpException);
      expect(() => controller.deleteProduct(999)).toThrow('Product not found');
      expect(service.deleteProduct).toHaveBeenCalledWith(999);
    });
  });
});