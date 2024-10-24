import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="modal-overlay" (click)="onClose.emit()"></div>
    <div class="modal-right" [class.show]="show">
      <div class="modal-header">
        <h3>{{title}}</h3>
        <button class="modal-close" (click)="onClose.emit()">×</button>
      </div>
      <div class="modal-content">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() show = false;
  @Input() title = '';
  @Output() onClose = new EventEmitter<void>();
}