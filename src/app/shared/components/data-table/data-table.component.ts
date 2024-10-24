import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Column {
  field: string;
  header: string;
  format?: (value: any) => string;
  showInTable?: boolean;
  showInDetails?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table>
      <thead>
        <tr>
          <th *ngFor="let column of displayColumns">{{column.header}}</th>
          <th class="actions-header">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of paginatedData">
          <td *ngFor="let column of displayColumns">
            {{getValue(item, column)}}
          </td>
          <td class="actions">
            <div class="action-buttons">
              <button (click)="onView.emit({item: item, detailColumns: detailColumns})" 
                      class="icon-button" 
                      title="View Details">
                👁️
              </button>
              <button (click)="onEdit.emit(item)" 
                      class="icon-button" 
                      title="Edit">
                ✏️
              </button>
              <button (click)="onDelete.emit(item)" 
                      class="icon-button delete" 
                      title="Delete">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <div class="pagination-info">
        Showing {{startIndex + 1}} to {{endIndex}} of {{data.length}} entries
      </div>
      <div class="pagination-controls">
        <button 
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)"
          class="btn-secondary"
        >
          Previous
        </button>
        <span class="page-numbers">
          <button 
            *ngFor="let page of pageNumbers"
            (click)="changePage(page)"
            class="btn-secondary"
            [class.active]="currentPage === page"
          >
            {{page}}
          </button>
        </span>
        <button 
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)"
          class="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .actions-header {
      width: 120px;
      text-align: center;
    }
    .actions {
      padding: 8px !important;
      text-align: center;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .icon-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 4px;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
    }
    .icon-button:hover {
      background-color: #f0f0f0;
    }
    .icon-button.delete:hover {
      background-color: #fee2e2;
    }
    .pagination {
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pagination-info {
      color: #666;
    }
    .pagination-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }
    .page-numbers button {
      min-width: 32px;
      height: 32px;
      padding: 0;
    }
    .page-numbers button.active {
      background-color: #405189;
      color: white;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onView = new EventEmitter<{item: any, detailColumns: Column[]}>();

  pageSize = 5;
  currentPage = 1;

  get displayColumns(): Column[] {
    return this.columns.filter(col => col.showInTable !== false);
  }

  get detailColumns(): Column[] {
    return this.columns.filter(col => col.showInDetails !== false);
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.data.length);
  }

  get paginatedData(): any[] {
    return this.data.slice(this.startIndex, this.endIndex);
  }

  getValue(item: any, column: Column): string {
    const value = item[column.field];
    return column.format ? column.format(value) : value;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}