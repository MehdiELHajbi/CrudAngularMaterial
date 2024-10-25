import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Orders</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>Orders management will be implemented here</p>
      </mat-card-content>
    </mat-card>
  `
})
export class OrdersComponent {}