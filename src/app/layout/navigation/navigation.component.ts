import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z2">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>My Application</span>
      <span class="spacer"></span>
      <button mat-icon-button>
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav mat-elevation-z2">
        <mat-nav-list>
          <h2 matSubheader>Menu</h2>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active-link">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Products</span>
          </a>
          <a mat-list-item routerLink="/orders" routerLinkActive="active-link">
            <mat-icon matListItemIcon>shopping_cart</mat-icon>
            <span matListItemTitle>Orders</span>
          </a>
          <mat-divider></mat-divider>
          <h2 matSubheader>Settings</h2>
          <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 250px;
      background-color: #fafafa;
    }

    .active-link {
      background-color: #e3f2fd !important;
      border-left: 4px solid #1976d2;
    }

    mat-nav-list {
      padding-top: 0;
    }

    h2[matSubheader] {
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin: 16px 0 8px 16px;
    }

    .mat-divider {
      margin: 8px 0;
    }
  `]
})
export class NavigationComponent {}