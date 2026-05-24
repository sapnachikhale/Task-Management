import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent, TaskFilter } from '../../shared/components/filter-bar/filter-bar.component';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { TaskFormComponent } from '../../shared/components/task-form/task-form.component';

import { TaskService } from '../../core/services/task.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';
import { Task, Status } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    NavbarComponent,
    ToastComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    FilterBarComponent,
    TaskCardComponent,
    TaskFormComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <app-filter-bar (filterChange)="onFilterChange($event)"></app-filter-bar>

    <!-- Loading State -->
    <app-spinner *ngIf="isLoading" [overlay]="true"></app-spinner>

    <!-- Kanban Board -->
    <div class="kanban-board" *ngIf="!isLoading">
      <!-- To Do Column -->
      <div class="kanban-column animate-slide-up" style="animation-delay: 0.1s">
        <div class="kanban-column-header">
          <div class="kanban-column-title">
            <span class="column-dot dot-todo"></span>
            To Do
          </div>
          <span class="kanban-column-count">{{ filteredTodo.length }}</span>
        </div>
        <div
          class="kanban-column-body"
          cdkDropList
          #todoList="cdkDropList"
          [cdkDropListData]="filteredTodo"
          [cdkDropListConnectedTo]="[inProgressList, completedList]"
          (cdkDropListDropped)="onDrop($event, 'todo')"
        >
          <app-task-card
            *ngFor="let task of filteredTodo; trackBy: trackById"
            [task]="task"
            cdkDrag
            (edit)="openEditForm($event)"
            (delete)="confirmDelete($event)"
          ></app-task-card>
          <div class="kanban-empty" *ngIf="filteredTodo.length === 0">
            <span class="kanban-empty-icon">📋</span>
            <span>No tasks to do</span>
          </div>
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="kanban-column animate-slide-up" style="animation-delay: 0.2s">
        <div class="kanban-column-header">
          <div class="kanban-column-title">
            <span class="column-dot dot-progress"></span>
            In Progress
          </div>
          <span class="kanban-column-count">{{ filteredInProgress.length }}</span>
        </div>
        <div
          class="kanban-column-body"
          cdkDropList
          #inProgressList="cdkDropList"
          [cdkDropListData]="filteredInProgress"
          [cdkDropListConnectedTo]="[todoList, completedList]"
          (cdkDropListDropped)="onDrop($event, 'in-progress')"
        >
          <app-task-card
            *ngFor="let task of filteredInProgress; trackBy: trackById"
            [task]="task"
            cdkDrag
            (edit)="openEditForm($event)"
            (delete)="confirmDelete($event)"
          ></app-task-card>
          <div class="kanban-empty" *ngIf="filteredInProgress.length === 0">
            <span class="kanban-empty-icon">🚀</span>
            <span>Nothing in progress</span>
          </div>
        </div>
      </div>

      <!-- Completed Column -->
      <div class="kanban-column animate-slide-up" style="animation-delay: 0.3s">
        <div class="kanban-column-header">
          <div class="kanban-column-title">
            <span class="column-dot dot-completed"></span>
            Completed
          </div>
          <span class="kanban-column-count">{{ filteredCompleted.length }}</span>
        </div>
        <div
          class="kanban-column-body"
          cdkDropList
          #completedList="cdkDropList"
          [cdkDropListData]="filteredCompleted"
          [cdkDropListConnectedTo]="[todoList, inProgressList]"
          (cdkDropListDropped)="onDrop($event, 'completed')"
        >
          <app-task-card
            *ngFor="let task of filteredCompleted; trackBy: trackById"
            [task]="task"
            cdkDrag
            (edit)="openEditForm($event)"
            (delete)="confirmDelete($event)"
          ></app-task-card>
          <div class="kanban-empty" *ngIf="filteredCompleted.length === 0">
            <span class="kanban-empty-icon">✅</span>
            <span>No completed tasks</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button class="fab" (click)="openCreateForm()" title="Add Task">＋</button>

    <!-- Task Form Modal -->
    <app-task-form
      *ngIf="showForm"
      [task]="editingTask"
      (save)="onSaveTask($event)"
      (close)="closeForm()"
    ></app-task-form>

    <!-- Confirm Dialog -->
    <app-confirm-dialog
      [visible]="showConfirm"
      title="Delete Task"
      [message]="'Are you sure you want to delete \\'' + (deletingTask?.title || '') + '\\'? This action cannot be undone.'"
      confirmText="Delete"
      (confirmed)="onConfirmDelete($event)"
    ></app-confirm-dialog>

    <!-- Toast Notifications -->
    <app-toast></app-toast>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--color-bg-primary);
    }

    .column-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .dot-todo {
      background: var(--color-info);
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
    }

    .dot-progress {
      background: var(--color-warning);
      box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    }

    .dot-completed {
      background: var(--color-success);
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }

    /* Skeleton loading cards */
    .skeleton-card {
      height: 120px;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-3);
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  allTasks: Task[] = [];
  isLoading = true;
  showForm = false;
  showConfirm = false;
  editingTask: Task | null = null;
  deletingTask: Task | null = null;

  // Filter
  currentFilter: TaskFilter = { search: '', priority: '', status: '', dueDate: '' };

  private subs: Subscription[] = [];

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.init();
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  // --- Data ---
  loadTasks(): void {
    this.isLoading = true;
    const sub = this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.show('Failed to load tasks', 'error');
      }
    });
    this.subs.push(sub);
  }

  // --- Filtering ---
  get filteredTasks(): Task[] {
    let tasks = [...this.allTasks];
    const f = this.currentFilter;

    if (f.search) {
      const q = f.search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    if (f.priority) {
      tasks = tasks.filter(t => t.priority === f.priority);
    }
    if (f.status) {
      tasks = tasks.filter(t => t.status === f.status);
    }
    if (f.dueDate) {
      tasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        return new Date(t.dueDate).toISOString().split('T')[0] === f.dueDate;
      });
    }
    return tasks;
  }

  get filteredTodo(): Task[] {
    return this.filteredTasks.filter(t => t.status === 'todo');
  }

  get filteredInProgress(): Task[] {
    return this.filteredTasks.filter(t => t.status === 'in-progress');
  }

  get filteredCompleted(): Task[] {
    return this.filteredTasks.filter(t => t.status === 'completed');
  }

  onFilterChange(filter: TaskFilter): void {
    this.currentFilter = filter;
  }

  // --- Drag & Drop ---
  onDrop(event: CdkDragDrop<Task[]>, targetStatus: Status): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status on server
      const taskId = task._id || task.id || '';
      this.taskService.updateStatus(taskId, targetStatus).subscribe({
        next: (updated) => {
          // Update local task
          const idx = this.allTasks.findIndex(t => (t._id || t.id) === taskId);
          if (idx >= 0) {
            this.allTasks[idx] = { ...this.allTasks[idx], status: targetStatus };
          }
          this.toastService.show(`Task moved to ${this.formatStatus(targetStatus)}`, 'success');
        },
        error: () => {
          this.toastService.show('Failed to update task status', 'error');
          this.loadTasks(); // Reload on error
        }
      });
    }
  }

  // --- CRUD ---
  openCreateForm(): void {
    this.editingTask = null;
    this.showForm = true;
  }

  openEditForm(task: Task): void {
    this.editingTask = { ...task };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTask = null;
  }

  onSaveTask(taskData: Partial<Task>): void {
    if (this.editingTask) {
      const id = this.editingTask._id || this.editingTask.id || '';
      this.taskService.updateTask(id, taskData).subscribe({
        next: (updated) => {
          const idx = this.allTasks.findIndex(t => (t._id || t.id) === id);
          if (idx >= 0) {
            this.allTasks[idx] = { ...this.allTasks[idx], ...updated };
          }
          this.toastService.show('Task updated successfully', 'success');
          this.closeForm();
        },
        error: () => {
          this.toastService.show('Failed to update task', 'error');
        }
      });
    } else {
      this.taskService.createTask(taskData).subscribe({
        next: (created) => {
          this.allTasks.push(created);
          this.toastService.show('Task created successfully', 'success');
          this.closeForm();
        },
        error: () => {
          this.toastService.show('Failed to create task', 'error');
        }
      });
    }
  }

  confirmDelete(task: Task): void {
    this.deletingTask = task;
    this.showConfirm = true;
  }

  onConfirmDelete(confirmed: boolean): void {
    if (confirmed && this.deletingTask) {
      const id = this.deletingTask._id || this.deletingTask.id || '';
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.allTasks = this.allTasks.filter(t => (t._id || t.id) !== id);
          this.toastService.show('Task deleted', 'info');
        },
        error: () => {
          this.toastService.show('Failed to delete task', 'error');
        }
      });
    }
    this.showConfirm = false;
    this.deletingTask = null;
  }

  // --- Helpers ---
  trackById(index: number, task: Task): string {
    return task._id || task.id || index.toString();
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  }
}
