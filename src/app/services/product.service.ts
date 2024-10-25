import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../store/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Product 1', price: 99.99, description: 'Description 1', stock: 10 },
    { id: 2, name: 'Product 2', price: 149.99, description: 'Description 2', stock: 5 }
  ];

  getProducts(): Observable<Product[]> {
    return of([...this.products]);
  }

  addProduct(product: Product): Observable<Product> {
    const newProduct = {
      ...product,
      id: Math.max(0, ...this.products.map(p => p.id)) + 1
    };
    this.products = [...this.products, newProduct];
    return of(newProduct);
  }

  updateProduct(product: Product): Observable<Product> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products = [
        ...this.products.slice(0, index),
        product,
        ...this.products.slice(index + 1)
      ];
      return of(product);
    }
    throw new Error('Product not found');
  }

  deleteProduct(id: number): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products = [
        ...this.products.slice(0, index),
        ...this.products.slice(index + 1)
      ];
      return of(void 0);
    }
    throw new Error('Product not found');
  }
}