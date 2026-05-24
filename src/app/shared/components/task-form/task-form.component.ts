import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, Priority, Status } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ task ? 'Edit Task' : 'Create New Task' }}</h2>
          <button class="btn btn-ghost btn-icon" (click)="close.emit()">✕</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="modal-body">
            <!-- Title -->
            <div class="form-group">
              <label class="form-label" for="title">Title</label>
              <input
                id="title"
                type="text"
                class="form-input"
                formControlName="title"
                placeholder="Enter task title..."
                [class.ng-invalid]="form.get('title')?.invalid"
                [class.ng-touched]="form.get('title')?.touched"
              />
              <span class="form-error" *ngIf="form.get('title')?.invalid && form.get('title')?.touched">
                <span *ngIf="form.get('title')?.errors?.['required']">Title is required</span>
                <span *ngIf="form.get('title')?.errors?.['minlength']">Title must be at least 3 characters</span>
              </span>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label" for="description">Description</label>
              <textarea
                id="description"
                class="form-textarea"
                formControlName="description"
                placeholder="Describe the task..."
                rows="3"
              ></textarea>
            </div>

            <!-- Priority & Status -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="priority">Priority</label>
                <select id="priority" class="form-select" formControlName="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="status">Status</label>
                <select id="status" class="form-select" formControlName="status">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <!-- Due Date -->
            <div class="form-group">
              <label class="form-label" for="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                class="form-input"
                formControlName="dueDate"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close.emit()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
              {{ task ? 'Update Task' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.form) {
      this.patchForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.task?.description || ''],
      priority: [this.task?.priority || 'medium'],
      status: [this.task?.status || 'todo'],
      dueDate: [this.task?.dueDate ? this.formatDateForInput(this.task.dueDate) : '']
    });
  }

  private patchForm(): void {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        priority: this.task.priority,
        status: this.task.status,
        dueDate: this.task.dueDate ? this.formatDateForInput(this.task.dueDate) : ''
      });
    } else {
      this.form.reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: ''
      });
    }
  }

  private formatDateForInput(date: string): string {
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.save.emit({
        ...formValue,
        dueDate: formValue.dueDate || undefined
      });
    }
  }
}
