import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="filterForm" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" placeholder="Filter by name">
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Price From</mat-label>
        <input matInput type="number" formControlName="priceFrom" placeholder="Minimum price">
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Price To</mat-label>
        <input matInput type="number" formControlName="priceTo" placeholder="Maximum price">
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field">
        <mat-label>Stock</mat-label>
        <input matInput type="number" formControlName="stock" placeholder="Minimum stock">
      </mat-form-field>

      <div class="form-actions">
        <button mat-button type="button" (click)="onReset()">Reset</button>
        <button mat-raised-button color="primary" type="submit">
          Apply Filters
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
  `]
})
export class ProductFilterComponent {
  @Output() filter = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      name: [''],
      priceFrom: [''],
      priceTo: [''],
      stock: ['']
    });
  }

  onSubmit(): void {
    this.filter.emit(this.filterForm.value);
  }

  onReset(): void {
    this.filterForm.reset({
      name: '',
      priceFrom: '',
      priceTo: '',
      stock: ''
    });
    this.reset.emit();
  }
}