import { Injectable } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, description: 'High-performance laptop' },
    { id: 2, name: 'Mouse', price: 25, description: 'Wireless mouse' },
    { id: 3, name: 'Keyboard', price: 75, description: 'Mechanical keyboard' }
  ];
  private nextId = 4;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  createProduct(productData: { name: string; price: number; description: string }): Product {
    const newProduct = {
      id: this.nextId++,
      ...productData
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, productData: { name?: string; price?: number; description?: string }): Product | undefined {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return undefined;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...productData
    };
    
    return this.products[productIndex];
  }

  deleteProduct(id: number): boolean {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    this.products.splice(productIndex, 1);
    return true;
  }
}
