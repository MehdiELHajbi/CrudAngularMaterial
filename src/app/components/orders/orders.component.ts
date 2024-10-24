import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as OrderActions from '../../store/order/order.actions';
import * as OrderSelectors from '../../store/order/order.selectors';
import * as ProductActions from '../../store/product/product.actions';
import * as ProductSelectors from '../../store/product/product.selectors';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DataTableComponent, Column } from '../../shared/components/data-table/data-table.component';
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

      <div *ngIf="loading$ | async" class="loading">Loading...</div>
      <div *ngIf="error$ | async as error" class="error">{{error}}</div>

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
          <label>Status</label>
          <select [(ngModel)]="filterStatus">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div class="form-group">
          <label>Product</label>
          <select [(ngModel)]="filterProduct">
            <option value="">All Products</option>
            <option *ngFor="let product of products$ | async" [value]="product.id">
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
              <option *ngFor="let product of products$ | async" [value]="product.id">
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
          <div class="form-group">
            <label>Status</label>
            <select [(ngModel)]="currentOrder.status" name="status" required>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div class="form-group">
            <label>Payment Method</label>
            <select [(ngModel)]="currentOrder.paymentMethod" name="paymentMethod" required>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>
          <div class="form-group">
            <label>Shipping Address</label>
            <textarea [(ngModel)]="currentOrder.shippingAddress" name="shippingAddress" required></textarea>
          </div>
          <div class="form-group">
            <label>Tracking Number</label>
            <input [(ngModel)]="currentOrder.trackingNumber" name="trackingNumber">
          </div>
          <div class="form-group">
            <label>Notes</label>
            <textarea [(ngModel)]="currentOrder.notes" name="notes"></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-modal
        [show]="showViewModal"
        title="Order Details"
        (onClose)="closeViewModal()"
      >
        <div class="order-details">
          <div *ngFor="let column of selectedDetailColumns" class="detail-row">
            <span class="label">{{column.header}}:</span>
            <span class="value">{{getValue(selectedOrder, column)}}</span>
          </div>
        </div>
      </app-modal>

      <app-data-table
        [columns]="columns"
        [data]="filteredOrders"
        (onView)="viewOrder($event)"
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
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-group textarea {
      min-height: 80px;
    }
    .modal-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
    .order-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .detail-row {
      display: flex;
      gap: 1rem;
    }
    .detail-row .label {
      font-weight: 500;
      min-width: 120px;
    }
    .detail-row .value {
      flex: 1;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      font-size: 1.2rem;
      color: #666;
    }
    .error {
      color: #dc2626;
      padding: 1rem;
      margin-bottom: 1rem;
      background-color: #fee2e2;
      border-radius: 4px;
    }
  `]
})
export class OrdersComponent implements OnInit {
  columns: Column[] = [
    { field: 'customerName', header: 'Customer', showInTable: true, showInDetails: true },
    { 
      field: 'productId', 
      header: 'Product',
      showInTable: true, 
      showInDetails: true,
      format: (value: number) => this.getProductName(value)
    },
    { field: 'quantity', header: 'Quantity', showInTable: true, showInDetails: true },
    { 
      field: 'total', 
      header: 'Total',
      showInTable: true, 
      showInDetails: true,
      format: (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },
    { field: 'status', header: 'Status', showInTable: true, showInDetails: true },
    { field: 'paymentMethod', header: 'Payment Method', showInTable: false, showInDetails: true },
    { field: 'shippingAddress', header: 'Shipping Address', showInTable: false, showInDetails: true },
    { field: 'trackingNumber', header: 'Tracking Number', showInTable: false, showInDetails: true },
    { 
      field: 'orderDate', 
      header: 'Order Date',
      showInTable: true, 
      showInDetails: true,
      format: (value: Date) => new Date(value).toLocaleDateString()
    },
    { field: 'notes', header: 'Notes', showInTable: false, showInDetails: true }
  ];

  orders$ = this.store.select(OrderSelectors.selectAllOrders);
  products$ = this.store.select(ProductSelectors.selectAllProducts);
  loading$ = this.store.select(OrderSelectors.selectOrderLoading);
  error$ = this.store.select(OrderSelectors.selectOrderError);

  currentOrder: Order = {
    id: 0,
    productId: 0,
    quantity: 1,
    customerName: '',
    orderDate: new Date(),
    total: 0,
    status: 'Pending',
    paymentMethod: '',
    shippingAddress: '',
    trackingNumber: '',
    notes: ''
  };
  
  showForm = false;
  showFilterForm = false;
  showViewModal = false;
  editMode = false;
  filterCustomer = '';
  filterProduct = '';
  filterStatus = '';
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  selectedDetailColumns: Column[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Load orders immediately
    this.store.dispatch(OrderActions.loadOrders());
    
    // Check if products are already loaded
    this.store.select(ProductSelectors.selectProductsLoaded)
      .pipe(take(1))
      .subscribe(loaded => {
        if (!loaded) {
          this.store.dispatch(ProductActions.loadProducts());
        }
      });
    
    this.orders$.subscribe(orders => {
      this.filteredOrders = orders;
      this.applyFilter();
    });
  }

  getValue(item: any, column: Column): string {
    if (!item) return '';
    const value = item[column.field];
    return column.format ? column.format(value) : value;
  }

  toggleFilter() {
    this.showFilterForm = !this.showFilterForm;
  }

  applyFilter() {
    this.orders$.subscribe(orders => {
      this.filteredOrders = orders.filter(order => {
        const customerMatch = !this.filterCustomer || 
          order.customerName.toLowerCase().includes(this.filterCustomer.toLowerCase());
        const statusMatch = !this.filterStatus ||
          order.status === this.filterStatus;
        const productMatch = !this.filterProduct || 
          order.productId.toString() === this.filterProduct;
        return customerMatch && productMatch && statusMatch;
      });
    });
  }

  clearFilter() {
    this.filterCustomer = '';
    this.filterProduct = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  viewOrder(event: {item: Order, detailColumns: Column[]}) {
    this.selectedOrder = event.item;
    this.selectedDetailColumns = event.detailColumns;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedOrder = null;
    this.selectedDetailColumns = [];
  }

  showAddForm() {
    this.editMode = false;
    this.currentOrder = {
      id: 0,
      productId: 0,
      quantity: 1,
      customerName: '',
      orderDate: new Date(),
      total: 0,
      status: 'Pending',
      paymentMethod: '',
      shippingAddress: '',
      trackingNumber: '',
      notes: ''
    };
    this.showForm = true;
  }

  editOrder(order: Order) {
    this.editMode = true;
    this.currentOrder = { ...order };
    this.showForm = true;
  }

  saveOrder() {
    this.products$.pipe(
      map((products: Product[]) => products.find(p => p.id === this.currentOrder.productId))
    ).subscribe(product => {
      if (product) {
        this.currentOrder.total = product.price * this.currentOrder.quantity;
        this.currentOrder.orderDate = new Date();
        if (this.editMode) {
          this.store.dispatch(OrderActions.updateOrder({ order: this.currentOrder }));
        } else {
          this.store.dispatch(OrderActions.addOrder({ order: this.currentOrder }));
        }
        this.showForm = false;
      }
    });
  }

  deleteOrder(id: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.store.dispatch(OrderActions.deleteOrder({ id }));
    }
  }

  cancelEdit() {
    this.showForm = false;
  }

  getProductName(productId: number): string {
    let productName = '';
    this.products$.pipe(
      map((products: Product[]) => products.find(p => p.id === productId))
    ).subscribe(product => {
      productName = product ? product.name : '';
    });
    return productName;
  }
}