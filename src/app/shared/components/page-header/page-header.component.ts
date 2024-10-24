import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <h2>{{title}}</h2>
      <div class="actions">
        <button (click)="onFilter.emit()" class="btn-secondary">
          <span>🔍 Filter</span>
        </button>
        <button (click)="onAdd.emit()" class="btn-primary">Add {{entityName}}</button>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() entityName = '';
  @Output() onFilter = new EventEmitter<void>();
  @Output() onAdd = new EventEmitter<void>();
}