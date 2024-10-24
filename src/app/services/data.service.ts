import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private products: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299, description: 'High-performance laptop' },
    { id: 2, name: 'Smartphone X', price: 899, description: 'Latest smartphone model' },
    { id: 3, name: 'Wireless Headphones', price: 199, description: 'Noise-canceling headphones' },
    { id: 4, name: 'Smart Watch', price: 299, description: 'Fitness tracking watch' },
    { id: 5, name: 'Tablet Air', price: 499, description: 'Lightweight tablet' },
    { id: 6, name: 'Desktop PC', price: 999, description: 'Powerful desktop computer' },
    { id: 7, name: 'Gaming Console', price: 399, description: 'Next-gen gaming system' },
    { id: 8, name: 'Wireless Mouse', price: 49, description: 'Ergonomic mouse' },
    { id: 9, name: 'Keyboard Pro', price: 129, description: 'Mechanical keyboard' },
    { id: 10, name: 'Monitor 4K', price: 599, description: 'Ultra HD display' },
    { id: 11, name: 'Printer', price: 249, description: 'Color laser printer' },
    { id: 12, name: 'External SSD', price: 159, description: '1TB portable drive' }
  ];

  private orders: Order[] = [
    { id: 1, productId: 1, quantity: 2, customerName: 'John Doe', orderDate: new Date('2024-01-15'), total: 2598 },
    { id: 2, productId: 3, quantity: 1, customerName: 'Jane Smith', orderDate: new Date('2024-01-16'), total: 199 },
    { id: 3, productId: 2, quantity: 3, customerName: 'Mike Johnson', orderDate: new Date('2024-01-17'), total: 2697 },
    { id: 4, productId: 5, quantity: 1, customerName: 'Sarah Wilson', orderDate: new Date('2024-01-18'), total: 499 },
    { id: 5, productId: 4, quantity: 2, customerName: 'Tom Brown', orderDate: new Date('2024-01-19'), total: 598 },
    { id: 6, productId: 7, quantity: 1, customerName: 'Emily Davis', orderDate: new Date('2024-01-20'), total: 399 },
    { id: 7, productId: 6, quantity: 1, customerName: 'David Miller', orderDate: new Date('2024-01-21'), total: 999 },
    { id: 8, productId: 8, quantity: 3, customerName: 'Lisa Anderson', orderDate: new Date('2024-01-22'), total: 147 },
    { id: 9, productId: 10, quantity: 2, customerName: 'Chris Taylor', orderDate: new Date('2024-01-23'), total: 1198 },
    { id: 10, productId: 9, quantity: 1, customerName: 'Amy White', orderDate: new Date('2024-01-24'), total: 129 }
  ];

  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  addProduct(product: Product): void {
    this.products.push({ ...product, id: Math.max(...this.products.map(p => p.id)) + 1 });
    this.productsSubject.next(this.products);
  }

  updateProduct(product: Product): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
      this.productsSubject.next(this.products);
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.productsSubject.next(this.products);
  }

  addOrder(order: Order): void {
    this.orders.push({ ...order, id: Math.max(...this.orders.map(o => o.id)) + 1 });
    this.ordersSubject.next(this.orders);
  }

  updateOrder(order: Order): void {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
      this.ordersSubject.next(this.orders);
    }
  }

  deleteOrder(id: number): void {
    this.orders = this.orders.filter(o => o.id !== id);
    this.ordersSubject.next(this.orders);
  }
}