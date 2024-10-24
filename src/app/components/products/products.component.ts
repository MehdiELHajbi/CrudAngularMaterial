import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as ProductActions from '../../store/product/product.actions';
import * as ProductSelectors from '../../store/product/product.selectors';
import { Product } from '../../models/product.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DataTableComponent, Column } from '../../shared/components/data-table/data-table.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-products',
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
        title="Products"
        entityName="Product"
        (onFilter)="toggleFilter()"
        (onAdd)="showAddForm()"
      ></app-page-header>

      <div *ngIf="loading$ | async" class="loading">Loading...</div>
      <div *ngIf="error$ | async as error" class="error">{{error}}</div>

      <app-modal
        [show]="showFilterForm"
        title="Filter Products"
        (onClose)="toggleFilter()"
      >
        <div class="form-group">
          <label>Name</label>
          <input [(ngModel)]="filterName" placeholder="Filter by name">
        </div>
        <div class="form-group">
          <label>Category</label>
          <input [(ngModel)]="filterCategory" placeholder="Filter by category">
        </div>
        <div class="form-group">
          <label>Max Price</label>
          <input [(ngModel)]="filterPrice" type="number" placeholder="Filter by max price">
        </div>
        <div class="modal-actions">
          <button (click)="applyFilter()" class="btn-primary">Apply</button>
          <button (click)="clearFilter()" class="btn-secondary">Clear</button>
        </div>
      </app-modal>

      <app-modal
        [show]="showForm"
        [title]="editMode ? 'Edit Product' : 'Add Product'"
        (onClose)="cancelEdit()"
      >
        <form (submit)="saveProduct()">
          <div class="form-group">
            <label>Name</label>
            <input [(ngModel)]="currentProduct.name" name="name" required>
          </div>
          <div class="form-group">
            <label>SKU</label>
            <input [(ngModel)]="currentProduct.sku" name="sku" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <input [(ngModel)]="currentProduct.category" name="category" required>
          </div>
          <div class="form-group">
            <label>Price</label>
            <input [(ngModel)]="currentProduct.price" name="price" type="number" required>
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input [(ngModel)]="currentProduct.stock" name="stock" type="number" required>
          </div>
          <div class="form-group">
            <label>Rating</label>
            <input [(ngModel)]="currentProduct.rating" name="rating" type="number" min="0" max="5" step="0.1" required>
          </div>
          <div class="form-group">
            <label>Manufacturer</label>
            <input [(ngModel)]="currentProduct.manufacturer" name="manufacturer" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="currentProduct.description" name="description" required></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" (click)="cancelEdit()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </app-modal>

      <app-modal
        [show]="showViewModal"
        title="Product Details"
        (onClose)="closeViewModal()"
      >
        <div class="product-details">
          <div *ngFor="let column of selectedDetailColumns" class="detail-row">
            <span class="label">{{column.header}}:</span>
            <span class="value">{{getValue(selectedProduct, column)}}</span>
          </div>
        </div>
      </app-modal>

      <app-data-table
        [columns]="columns"
        [data]="filteredProducts"
        (onView)="viewProduct($event)"
        (onEdit)="editProduct($event)"
        (onDelete)="deleteProduct($event.id)"
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
    .form-group input, .form-group textarea {
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
    .product-details {
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
export class ProductsComponent implements OnInit {
  columns: Column[] = [
    { field: 'name', header: 'Name', showInTable: true, showInDetails: true },
    { field: 'sku', header: 'SKU', showInTable: true, showInDetails: true },
    { field: 'category', header: 'Category', showInTable: true, showInDetails: true },
    { 
      field: 'price', 
      header: 'Price', 
      showInTable: true, 
      showInDetails: true,
      format: (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    },
    { field: 'stock', header: 'Stock', showInTable: true, showInDetails: true },
    { 
      field: 'rating', 
      header: 'Rating', 
      showInTable: true, 
      showInDetails: true,
      format: (value: number) => `${value}/5`
    },
    { field: 'manufacturer', header: 'Manufacturer', showInTable: false, showInDetails: true },
    { field: 'description', header: 'Description', showInTable: false, showInDetails: true },
    { 
      field: 'lastUpdated', 
      header: 'Last Updated', 
      showInTable: false, 
      showInDetails: true,
      format: (value: Date) => new Date(value).toLocaleString()
    }
  ];

  products$ = this.store.select(ProductSelectors.selectAllProducts);
  loading$ = this.store.select(ProductSelectors.selectProductLoading);
  error$ = this.store.select(ProductSelectors.selectProductError);

  currentProduct: Product = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    sku: '',
    category: '',
    stock: 0,
    rating: 0,
    manufacturer: '',
    lastUpdated: new Date()
  };
  
  showForm = false;
  showFilterForm = false;
  showViewModal = false;
  editMode = false;
  filterName = '';
  filterPrice: number | null = null;
  filterCategory = '';
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  selectedDetailColumns: Column[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts());
    this.products$.subscribe(products => {
      this.filteredProducts = products;
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
    this.products$.subscribe(products => {
      this.filteredProducts = products.filter(product => {
        const nameMatch = !this.filterName || 
          product.name.toLowerCase().includes(this.filterName.toLowerCase());
        const categoryMatch = !this.filterCategory || 
          product.category.toLowerCase().includes(this.filterCategory.toLowerCase());
        const priceMatch = !this.filterPrice || 
          product.price <= this.filterPrice;
        return nameMatch && categoryMatch && priceMatch;
      });
    });
  }

  clearFilter() {
    this.filterName = '';
    this.filterCategory = '';
    this.filterPrice = null;
    this.applyFilter();
  }

  viewProduct(event: {item: Product, detailColumns: Column[]}) {
    this.selectedProduct = event.item;
    this.selectedDetailColumns = event.detailColumns;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedProduct = null;
    this.selectedDetailColumns = [];
  }

  showAddForm() {
    this.editMode = false;
    this.currentProduct = {
      id: 0,
      name: '',
      price: 0,
      description: '',
      sku: '',
      category: '',
      stock: 0,
      rating: 0,
      manufacturer: '',
      lastUpdated: new Date()
    };
    this.showForm = true;
  }

  editProduct(product: Product) {
    this.editMode = true;
    this.currentProduct = { ...product };
    this.showForm = true;
  }

  saveProduct() {
    this.currentProduct.lastUpdated = new Date();
    if (this.editMode) {
      this.store.dispatch(ProductActions.updateProduct({ product: this.currentProduct }));
    } else {
      this.store.dispatch(ProductActions.addProduct({ product: this.currentProduct }));
    }
    this.showForm = false;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.dispatch(ProductActions.deleteProduct({ id }));
    }
  }

  cancelEdit() {
    this.showForm = false;
  }
}