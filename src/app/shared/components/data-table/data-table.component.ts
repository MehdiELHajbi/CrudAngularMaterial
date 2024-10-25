import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-label>Search</mat-label>
      <input matInput (keyup)="applyFilter($event)" placeholder="Type to search..." #input>
    </mat-form-field>

    <div class="mat-elevation-z2 table-container">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>{{ column.label }}</th>
          <td mat-cell *matCellDef="let row">{{ row[column.key] }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button color="primary" (click)="onView.emit(row)" matTooltip="View Details">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="primary" (click)="onEdit.emit(row)" matTooltip="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="onDelete.emit(row)" matTooltip="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            No data matching the filter "{{input.value}}"
          </td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"
                     aria-label="Select page">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .table-container {
      position: relative;
      min-height: 200px;
      max-height: 600px;
      overflow: auto;
    }

    table {
      width: 100%;
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    .mat-column-actions {
      width: 150px;
      text-align: center;
    }
  `]
})
export class DataTableComponent {
  @Input() set data(value: any[]) {
    this.dataSource.data = value;
  }
  @Input() columns: { key: string; label: string }[] = [];
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  ngOnInit() {
    this.displayedColumns = [...this.columns.map(col => col.key), 'actions'];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}