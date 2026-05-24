import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card glass-card" cdkDrag>
      <div class="task-card-header">
        <span class="badge" [ngClass]="'badge-' + task.priority">
          {{ task.priority }}
        </span>
        <div class="task-card-actions">
          <button class="btn btn-ghost btn-icon action-btn" (click)="edit.emit(task)" title="Edit">
            ✎
          </button>
          <button class="btn btn-ghost btn-icon action-btn delete-btn" (click)="delete.emit(task)" title="Delete">
            🗑
          </button>
        </div>
      </div>

      <h3 class="task-card-title">{{ task.title }}</h3>

      <p class="task-card-desc" *ngIf="task.description">
        {{ task.description | slice:0:100 }}{{ task.description && task.description.length > 100 ? '...' : '' }}
      </p>

      <div class="task-card-footer">
        <span class="badge" [ngClass]="'badge-' + task.status">
          {{ formatStatus(task.status) }}
        </span>
        <span class="task-card-date" *ngIf="task.dueDate">
          📅 {{ task.dueDate | date:'MMM d' }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      padding: var(--space-4);
      cursor: grab;
      animation: slideUp 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .task-card:active {
      cursor: grabbing;
    }

    .task-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .task-card-actions {
      display: flex;
      gap: var(--space-1);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .task-card:hover .task-card-actions {
      opacity: 1;
    }

    .action-btn {
      width: 30px;
      height: 30px;
      font-size: var(--font-size-sm);
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
    }

    .delete-btn:hover {
      color: var(--color-danger);
      background: var(--color-danger-bg);
    }

    .task-card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
    }

    .task-card-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-normal);
    }

    .task-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

    .task-card-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();

  formatStatus(status: string): string {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  }
}
