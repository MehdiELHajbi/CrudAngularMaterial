import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { Product } from '../store/product/product.model';
import * as ProductActions from '../store/product/product.actions';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SlidingPanelComponent } from '../shared/components/sliding-panel/sliding-panel.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DataTableComponent,
    SlidingPanelComponent,
    ProductDetailsComponent,
    ProductFormComponent,
    ProductFilterComponent
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Products</mat-card-title>
        <div class="header-actions">
          <button mat-raised-button (click)="openFilterPanel()">
            <mat-icon>filter_list</mat-icon>
            Filter
          </button>
          <button mat-raised-button color="primary" (click)="openProductForm()">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
        </div>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="loading$ | async" class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <div *ngIf="error$ | async as error" class="error-message">
          {{ error }}
        </div>

        <app-data-table
          [data]="(filteredProducts$ | async) || []"
          [columns]="columns"
          (onView)="viewProductDetails($event)"
          (onEdit)="openProductForm($event)"
          (onDelete)="confirmDelete($event)">
        </app-data-table>
      </mat-card-content>
    </mat-card>

    <app-sliding-panel
      [isOpen]="isPanelOpen"
      [title]="getPanelTitle()"
      (close)="closePanel()">
      <app-product-details
        *ngIf="selectedProduct && !isEditing && !isFiltering"
        [product]="selectedProduct">
      </app-product-details>
      <app-product-form
        *ngIf="isEditing && !isFiltering"
        [product]="selectedProduct"
        (save)="saveProduct($event)"
        (cancel)="closePanel()">
      </app-product-form>
      <app-product-filter
        *ngIf="isFiltering"
        (filter)="applyFilter($event)"
        (reset)="resetFilter()">
      </app-product-filter>
    </app-sliding-panel>
  `,
  styles: [`
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .error-message {
      color: red;
      margin: 20px 0;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isPanelOpen = false;
  isEditing = false;
  isFiltering = false;
  selectedProduct: Product | null = null;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'description', label: 'Description' }
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    this.products$ = store.select(state => state.products.products);
    this.filteredProducts$ = store.select(state => state.products.filteredProducts);
    this.loading$ = store.select(state => state.products.loading);
    this.error$ = store.select(state => state.products.error);
  }

  ngOnInit() {
    this.store.dispatch(ProductActions.loadProducts());
  }

  openFilterPanel() {
    this.isFiltering = true;
    this.isEditing = false;
    this.selectedProduct = null;
    this.isPanelOpen = true;
  }

  applyFilter(filter: any) {
    this.store.dispatch(ProductActions.setProductFilter({ filter }));
  }

  resetFilter() {
    this.store.dispatch(ProductActions.clearProductFilter());
  }

  getPanelTitle(): string {
    if (this.isFiltering) {
      return 'Filter Products';
    }
    if (this.isEditing) {
      return this.selectedProduct ? 'Edit Product' : 'Add Product';
    }
    return this.selectedProduct?.name || 'Product Details';
  }

  viewProductDetails(product: Product) {
    this.selectedProduct = product;
    this.isEditing = false;
    this.isFiltering = false;
    this.isPanelOpen = true;
  }

  openProductForm(product?: Product) {
    this.selectedProduct = product || null;
    this.isEditing = true;
    this.isFiltering = false;
    this.isPanelOpen = true;
  }

  closePanel() {
    this.isPanelOpen = false;
    this.isEditing = false;
    this.isFiltering = false;
    this.selectedProduct = null;
  }

  saveProduct(product: Product) {
    if (this.selectedProduct?.id) {
      this.store.dispatch(ProductActions.updateProduct({ product: { ...product, id: this.selectedProduct.id } }));
    } else {
      this.store.dispatch(ProductActions.addProduct({ product }));
    }
    this.closePanel();
  }

  confirmDelete(product: Product) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete ${product.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(ProductActions.deleteProduct({ id: product.id }));
      }
    });
  }
}