import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table>
      <thead>
        <tr>
          <th *ngFor="let column of columns">{{column.header}}</th>
          <th *ngIf="showActions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of paginatedData">
          <td *ngFor="let column of columns">
            {{getValue(item, column)}}
          </td>
          <td *ngIf="showActions" class="actions">
            <button (click)="onEdit.emit(item)" class="btn-secondary">Edit</button>
            <button (click)="onDelete.emit(item)" class="btn-danger">Delete</button>
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
    .actions {
      display: flex;
      gap: 0.5rem;
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
  @Input() columns: Array<{field: string; header: string; format?: (value: any) => string}> = [];
  @Input() data: any[] = [];
  @Input() showActions = true;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  pageSize = 5;
  currentPage = 1;

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

  getValue(item: any, column: any): string {
    const value = item[column.field];
    return column.format ? column.format(value) : value;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}