import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="logo">
        <h1>VELZON</h1>
      </div>
      <div class="menu-label">MENU</div>
      <nav>
        <a routerLink="/products" routerLinkActive="active">
          <i class="icon">📦</i>
          <span>Products</span>
        </a>
        <a routerLink="/orders" routerLinkActive="active">
          <i class="icon">🛍️</i>
          <span>Orders</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #405189;
      color: white;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .logo {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .menu-label {
      padding: 20px;
      font-size: 12px;
      font-weight: 600;
      opacity: 0.7;
      text-transform: uppercase;
    }
    nav {
      display: flex;
      flex-direction: column;
    }
    nav a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.3s ease;
    }
    nav a:hover {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }
    nav a.active {
      background-color: rgba(255,255,255,0.1);
      color: white;
      border-left: 3px solid white;
    }
    .icon {
      font-size: 18px;
    }
  `]
})
export class SidebarComponent {}