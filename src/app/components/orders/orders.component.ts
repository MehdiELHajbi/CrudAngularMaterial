import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    DataTableComponent,
    PageHeaderComponent
  ],
  template: `
    <div class="container">
      <app-page-header
        title="Orders"
        entityName="Order"
        (onFilter)="toggleFilter()"
        (onAdd)="showAddForm()"
      ></app-page-header>

      <app-modal
        [show]="showFilterForm"
        title="Filter Orders"
        (onClose)="toggleFilter()"
      >
        <div class="form-group">
          <label>Customer Name</label>
          <input [(ngModel)]="filterCustomer" placeholder="Filter by customer">
        </div>
        <div class="form-group">
          <label>Product</label>
          <select [(ngModel)]="filterProduct">
            <option value="">All Products</option>
            <option *ngFor="let product of products" [value]="product.id">
              {{product.name}}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button (click)="applyFilter()" class="btn-primary">Apply</button>
          <button (click)="clearFilter()" class="btn-secondary">Clear</button>
        </div>
      </app-modal>

      <app-modal
        [show]="showForm"
        [title]="editMode ? 'Edit Order' : 'Add Order'"
        (onClose)="cancelEdit()"
      >
        <form (submit)="saveOrder()">
          <div class="form-group">
            <label>Product</label>
            <select [(ngModel)]="currentOrder.productId" name="productId" required>
              <option value="">Select Product</option>
              <option *ngFor="let product of products" [value]="product.id">
                {{product.name}} - {{product.price | currency}}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Quantity</label>
            <input [(ngModel)]="currentOrder.quantity" name="quantity" type="number" required>
          </div>
          <div class="form-group">
            <label>Customer Name</label>
            <input [(ngModel)]="currentOrder.customerName" name="customerName" required>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-data-table
        [columns]="columns"
        [data]="filteredOrders"
        (onEdit)="editOrder($event)"
        (onDelete)="deleteOrder($event.id)"
      ></app-data-table>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .modal-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `]
})
export class OrdersComponent implements OnInit {
  columns = [
    { field: 'customerName', header: 'Customer' },
    { 
      field: 'productId', 
      header: 'Product',
      format: (value: number) => this.getProductName(value)
    },
    { field: 'quantity', header: 'Quantity' },
    { 
      field: 'total', 
      header: 'Total',
      format: (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },
    { 
      field: 'orderDate', 
      header: 'Order Date',
      format: (value: Date) => new Date(value).toLocaleDateString()
    }
  ];

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  products: Product[] = [];
  currentOrder: Order = {
    id: 0,
    productId: 0,
    quantity: 1,
    customerName: '',
    orderDate: new Date(),
    total: 0
  };
  showForm = false;
  showFilterForm = false;
  editMode = false;
  filterCustomer = '';
  filterProduct = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.dataService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.applyFilter();
    });
  }

  toggleFilter() {
    this.showFilterForm = !this.showFilterForm;
  }

  applyFilter() {
    this.filteredOrders = this.orders.filter(order => {
      const customerMatch = !this.filterCustomer || 
        order.customerName.toLowerCase().includes(this.filterCustomer.toLowerCase());
      const productMatch = !this.filterProduct || 
        order.productId.toString() === this.filterProduct;
      return customerMatch && productMatch;
    });
  }

  clearFilter() {
    this.filterCustomer = '';
    this.filterProduct = '';
    this.applyFilter();
  }

  getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : '';
  }

  showAddForm() {
    this.editMode = false;
    this.currentOrder = {
      id: 0,
      productId: 0,
      quantity: 1,
      customerName: '',
      orderDate: new Date(),
      total: 0
    };
    this.showForm = true;
  }

  editOrder(order: Order) {
    this.editMode = true;
    this.currentOrder = { ...order };
    this.showForm = true;
  }

  saveOrder() {
    const product = this.products.find(p => p.id === this.currentOrder.productId);
    if (product) {
      this.currentOrder.total = product.price * this.currentOrder.quantity;
      if (this.editMode) {
        this.dataService.updateOrder(this.currentOrder);
      } else {
        this.dataService.addOrder(this.currentOrder);
      }
      this.showForm = false;
    }
  }

  deleteOrder(id: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.dataService.deleteOrder(id);
    }
  }

  cancelEdit() {
    this.showForm = false;
  }
}