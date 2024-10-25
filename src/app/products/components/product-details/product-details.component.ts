import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Product } from '../../../store/product/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatListModule],
  template: `
    <mat-list>
      <mat-list-item>
        <span matListItemTitle>Name</span>
        <span matListItemLine>{{ product.name }}</span>
      </mat-list-item>

      <mat-list-item>
        <span matListItemTitle>Price</span>
        <span matListItemLine>{{ product.price | currency }}</span>
      </mat-list-item>

      <mat-list-item>
        <span matListItemTitle>Stock</span>
        <span matListItemLine>{{ product.stock }} units</span>
      </mat-list-item>

      <mat-list-item>
        <span matListItemTitle>Description</span>
        <span matListItemLine>{{ product.description }}</span>
      </mat-list-item>
    </mat-list>
  `,
  styles: [`
    mat-list-item {
      margin-bottom: 16px;
    }

    [matListItemTitle] {
      color: #666;
      font-size: 14px;
    }

    [matListItemLine]:last-child {
      font-size: 16px;
      color: #333;
    }
  `]
})
export class ProductDetailsComponent {
  @Input() product!: Product;
}