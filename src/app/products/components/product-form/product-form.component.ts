import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../store/product/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" placeholder="Product name">
        <mat-error *ngIf="productForm.get('name')?.errors?.['required']">
          Name is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Price</mat-label>
        <input matInput type="number" formControlName="price" placeholder="Product price">
        <mat-error *ngIf="productForm.get('price')?.errors?.['required']">
          Price is required
        </mat-error>
        <mat-error *ngIf="productForm.get('price')?.errors?.['min']">
          Price must be greater than 0
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Stock</mat-label>
        <input matInput type="number" formControlName="stock" placeholder="Stock quantity">
        <mat-error *ngIf="productForm.get('stock')?.errors?.['required']">
          Stock is required
        </mat-error>
        <mat-error *ngIf="productForm.get('stock')?.errors?.['min']">
          Stock must be greater than or equal to 0
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" placeholder="Product description"></textarea>
        <mat-error *ngIf="productForm.get('description')?.errors?.['required']">
          Description is required
        </mat-error>
      </mat-form-field>

      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!productForm.valid">
          {{ product ? 'Update' : 'Add' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }

    textarea {
      min-height: 100px;
    }
  `]
})
export class ProductFormComponent {
  @Input() set product(value: Product | null) {
    if (value) {
      this.productForm.patchValue(value);
    } else {
      this.productForm.reset({
        name: '',
        price: '',
        stock: '',
        description: ''
      });
    }
  }
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.save.emit(this.productForm.value);
    }
  }

  onCancel(): void {
    this.productForm.reset({
      name: '',
      price: '',
      stock: '',
      description: ''
    });
    this.cancel.emit();
  }
}