import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const toast: Toast = { id, message, type, visible: true };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string): void {
    const toasts = this.toastsSubject.value.map(t =>
      t.id === id ? { ...t, visible: false } : t
    );
    this.toastsSubject.next(toasts);

    // Remove from array after animation
    setTimeout(() => {
      this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
    }, 300);
  }
}
