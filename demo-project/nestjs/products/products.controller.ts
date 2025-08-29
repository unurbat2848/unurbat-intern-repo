import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Post()
  createProduct(@Body() productData: { name: string; price: number; description: string }) {
    return this.productsService.createProduct(productData);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() productData: { name?: string; price?: number; description?: string }) {
    return this.productsService.updateProduct(Number(id), productData);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}
