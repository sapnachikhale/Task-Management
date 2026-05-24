import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/tasks`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/tasks`, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tasks/${id}`);
  }

  updateStatus(id: string, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/tasks/${id}/status`, { status });
  }
}
