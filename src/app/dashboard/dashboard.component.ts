import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatGridListModule],
  template: `
    <mat-grid-list cols="2" rowHeight="150px" gutterSize="16">
      <mat-grid-tile>
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Total Products</mat-card-title>
            <mat-icon color="primary">inventory_2</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <h2>150</h2>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>Total Orders</mat-card-title>
            <mat-icon color="primary">shopping_cart</mat-icon>
          </mat-card-header>
          <mat-card-content>
            <h2>24</h2>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [`
    .dashboard-card {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      margin: 8px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 32px;
      margin: 0;
      color: #1976d2;
    }
  `]
})
export class DashboardComponent {}