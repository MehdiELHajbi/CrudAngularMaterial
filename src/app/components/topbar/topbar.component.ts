import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="topbar">
      <div class="left">
        <div class="search-box">
          <input type="text" placeholder="Search...">
          <i class="search-icon">🔍</i>
        </div>
      </div>
      <div class="right">
        <button class="icon-button">🔔</button>
        <button class="icon-button">⚙️</button>
        <div class="user-profile">
          <img src="https://via.placeholder.com/32" alt="User">
          <span>Anna Adame</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      height: 64px;
      background-color: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
    }
    .left {
      display: flex;
      align-items: center;
    }
    .search-box {
      position: relative;
      margin-left: 20px;
    }
    .search-box input {
      width: 240px;
      padding: 8px 12px;
      padding-left: 36px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .icon-button {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .user-profile img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
    .user-profile span {
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class TopbarComponent {}