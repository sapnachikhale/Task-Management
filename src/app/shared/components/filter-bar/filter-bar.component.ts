import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TaskFilter {
  search: string;
  priority: string;
  status: string;
  dueDate: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-bar glass-card-static">
      <div class="filter-group search-group">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="form-input search-input"
          placeholder="Search tasks..."
          [(ngModel)]="filters.search"
          (ngModelChange)="onFilterChange()"
        />
      </div>

      <div class="filter-group">
        <select class="form-select" [(ngModel)]="filters.priority" (ngModelChange)="onFilterChange()">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div class="filter-group">
        <select class="form-select" [(ngModel)]="filters.status" (ngModelChange)="onFilterChange()">
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="filter-group">
        <input
          type="date"
          class="form-input"
          [(ngModel)]="filters.dueDate"
          (ngModelChange)="onFilterChange()"
        />
      </div>

      <button
        class="btn btn-ghost clear-btn"
        (click)="clearFilters()"
        *ngIf="hasActiveFilters()"
      >
        ✕ Clear
      </button>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-5);
      margin: var(--space-4) var(--space-6) 0;
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 150px;
    }

    .search-group {
      position: relative;
      flex: 2;
      min-width: 200px;
    }

    .search-icon {
      position: absolute;
      left: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--font-size-sm);
      z-index: 1;
      pointer-events: none;
    }

    .search-input {
      padding-left: var(--space-10);
    }

    .clear-btn {
      flex-shrink: 0;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }
    .clear-btn:hover {
      color: var(--color-danger);
    }

    @media (max-width: 768px) {
      .filter-bar {
        flex-direction: column;
        margin: var(--space-3) var(--space-4) 0;
        gap: var(--space-2);
      }

      .filter-group {
        width: 100%;
        min-width: unset;
      }
    }
  `]
})
export class FilterBarComponent {
  @Output() filterChange = new EventEmitter<TaskFilter>();

  filters: TaskFilter = {
    search: '',
    priority: '',
    status: '',
    dueDate: ''
  };

  onFilterChange(): void {
    this.filterChange.emit({ ...this.filters });
  }

  clearFilters(): void {
    this.filters = { search: '', priority: '', status: '', dueDate: '' };
    this.filterChange.emit({ ...this.filters });
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.search || this.filters.priority || this.filters.status || this.filters.dueDate);
  }
}
