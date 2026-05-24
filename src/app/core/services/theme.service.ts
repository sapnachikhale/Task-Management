import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDarkSubject.asObservable();

  init(): void {
    const saved = localStorage.getItem('taskflow_theme');
    const isDark = saved ? saved === 'dark' : true;
    this.isDarkSubject.next(isDark);
    this.applyTheme(isDark);
  }

  toggle(): void {
    const isDark = !this.isDarkSubject.value;
    this.isDarkSubject.next(isDark);
    this.applyTheme(isDark);
    localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}
