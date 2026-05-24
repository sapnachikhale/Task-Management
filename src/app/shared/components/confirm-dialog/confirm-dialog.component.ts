import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="visible" (click)="onCancel()">
      <div class="modal-content confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="btn btn-ghost btn-icon" (click)="onCancel()">✕</button>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onCancel()">Cancel</button>
          <button class="btn btn-danger" (click)="onConfirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-modal {
      max-width: 420px;
    }

    .confirm-message {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Delete';
  @Output() confirmed = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirmed.emit(true);
  }

  onCancel(): void {
    this.confirmed.emit(false);
  }
}
