import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all products', () => {
      const products = service.getAllProducts();
      expect(products).toHaveLength(3);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('price');
      expect(products[0]).toHaveProperty('description');
    });
  });

  describe('getProductById', () => {
    it('should return product when found', () => {
      const product = service.getProductById(1);
      expect(product).toBeDefined();
      expect(product?.name).toBe('Laptop');
      expect(product?.price).toBe(999);
    });

    it('should return undefined when product not found', () => {
      const product = service.getProductById(999);
      expect(product).toBeUndefined();
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const productData = {
        name: 'Monitor',
        price: 200,
        description: '24-inch monitor'
      };
      
      const initialCount = service.getAllProducts().length;
      const newProduct = service.createProduct(productData);
      
      expect(newProduct).toHaveProperty('id');
      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.price).toBe(productData.price);
      expect(newProduct.description).toBe(productData.description);
      
      const allProducts = service.getAllProducts();
      expect(allProducts).toHaveLength(initialCount + 1);
    });
  });

  describe('updateProduct', () => {
    it('should update existing product', () => {
      const updateData = { name: 'Gaming Laptop', price: 1299 };
      const updatedProduct = service.updateProduct(1, updateData);
      
      expect(updatedProduct).toBeDefined();
      expect(updatedProduct?.name).toBe('Gaming Laptop');
      expect(updatedProduct?.price).toBe(1299);
      expect(updatedProduct?.description).toBe('High-performance laptop'); // Should keep original
    });

    it('should return undefined for non-existent product', () => {
      const updateData = { name: 'Updated Product' };
      const result = service.updateProduct(999, updateData);
      
      expect(result).toBeUndefined();
    });
  });

  describe('deleteProduct', () => {
    it('should delete existing product', () => {
      const initialCount = service.getAllProducts().length;
      const result = service.deleteProduct(1);
      
      expect(result).toBe(true);
      const remainingProducts = service.getAllProducts();
      expect(remainingProducts).toHaveLength(initialCount - 1);
      expect(service.getProductById(1)).toBeUndefined();
    });

    it('should return false for non-existent product', () => {
      const result = service.deleteProduct(999);
      expect(result).toBe(false);
    });
  });
});