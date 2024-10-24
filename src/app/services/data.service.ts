import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import mockData from '../data/mock-data.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private products: Product[] = this.mapProducts(mockData.products);
  private orders: Order[] = this.mapOrders(mockData.orders);

  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  private mapProducts(data: any[]): Product[] {
    return data.map(item => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated)
    }));
  }

  private mapOrders(data: any[]): Order[] {
    return data.map(item => ({
      ...item,
      orderDate: new Date(item.orderDate)
    }));
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
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