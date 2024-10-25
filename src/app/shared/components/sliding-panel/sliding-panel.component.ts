import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sliding-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="sliding-panel-overlay" *ngIf="isOpen" (click)="close.emit()"></div>
    <div class="sliding-panel" [@slideInOut]="isOpen ? 'in' : 'out'">
      <div class="sliding-panel-header">
        <h2>{{ title }}</h2>
        <button mat-icon-button (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="sliding-panel-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      pointer-events: none;
    }

    .sliding-panel-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      pointer-events: auto;
    }

    .sliding-panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 400px;
      background-color: white;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
      pointer-events: auto;
      display: flex;
      flex-direction: column;
    }

    .sliding-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .sliding-panel-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    .sliding-panel-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(100%)'
      })),
      transition('in => out', animate('200ms ease-out')),
      transition('out => in', animate('200ms ease-in'))
    ])
  ]
})
export class SlidingPanelComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}