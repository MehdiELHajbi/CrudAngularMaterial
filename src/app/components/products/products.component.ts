import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Product } from '../../models/product.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
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
            <label>Price</label>
            <input [(ngModel)]="currentProduct.price" name="price" type="number" required>
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

      <app-data-table
        [columns]="columns"
        [data]="filteredProducts"
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
    .modal-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `]
})
export class ProductsComponent implements OnInit {
  columns = [
    { field: 'name', header: 'Name' },
    { field: 'price', header: 'Price', format: (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) },
    { field: 'description', header: 'Description' }
  ];

  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentProduct: Product = { id: 0, name: '', price: 0, description: '' };
  showForm = false;
  showFilterForm = false;
  editMode = false;
  filterName = '';
  filterPrice: number | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilter();
    });
  }

  toggleFilter() {
    this.showFilterForm = !this.showFilterForm;
  }

  applyFilter() {
    this.filteredProducts = this.products.filter(product => {
      const nameMatch = !this.filterName || 
        product.name.toLowerCase().includes(this.filterName.toLowerCase());
      const priceMatch = !this.filterPrice || 
        product.price <= this.filterPrice;
      return nameMatch && priceMatch;
    });
  }

  clearFilter() {
    this.filterName = '';
    this.filterPrice = null;
    this.applyFilter();
  }

  showAddForm() {
    this.editMode = false;
    this.currentProduct = { id: 0, name: '', price: 0, description: '' };
    this.showForm = true;
  }

  editProduct(product: Product) {
    this.editMode = true;
    this.currentProduct = { ...product };
    this.showForm = true;
  }

  saveProduct() {
    if (this.editMode) {
      this.dataService.updateProduct(this.currentProduct);
    } else {
      this.dataService.addProduct(this.currentProduct);
    }
    this.showForm = false;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.dataService.deleteProduct(id);
    }
  }

  cancelEdit() {
    this.showForm = false;
  }
}