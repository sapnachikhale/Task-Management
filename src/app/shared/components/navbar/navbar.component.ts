import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar">
      <div class="navbar-inner">
        <div class="navbar-left">
          <button class="navbar-hamburger btn-icon btn-ghost" (click)="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <span class="hamburger-icon">☰</span>
          </button>
          <h1 class="navbar-brand">
            <span class="gradient-text">TaskFlow</span>
          </h1>
        </div>

        <nav class="navbar-right" [class.mobile-open]="mobileMenuOpen">
          <div class="navbar-user" *ngIf="user">
            <div class="avatar">{{ getInitials(user.name) }}</div>
            <span class="navbar-username">{{ user.name }}</span>
          </div>

          <button class="btn btn-ghost btn-icon theme-toggle" (click)="toggleTheme()" [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <span *ngIf="isDark">☀️</span>
            <span *ngIf="!isDark">🌙</span>
          </button>

          <button class="btn btn-ghost logout-btn" (click)="logout()">
            <span class="logout-icon">⏻</span>
            <span class="logout-text">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 200;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      padding: 0 var(--space-6);
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      max-width: 1440px;
      margin: 0 auto;
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .navbar-hamburger {
      display: none;
      font-size: 1.3rem;
    }

    .navbar-brand {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.02em;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-full);
      background: var(--color-surface);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-accent), #A78BFA);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #fff;
      text-transform: uppercase;
    }

    .navbar-username {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
    }

    .theme-toggle {
      font-size: 1.1rem;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
    }
    .logout-btn:hover {
      color: var(--color-danger);
    }

    .logout-icon {
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0 var(--space-4);
      }

      .navbar-hamburger {
        display: flex;
      }

      .navbar-right {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--color-bg-secondary);
        border-bottom: 1px solid var(--color-border);
        padding: var(--space-4);
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);
        transform: translateY(-110%);
        transition: transform var(--transition-base);
        z-index: 199;
      }

      .navbar-right.mobile-open {
        transform: translateY(0);
      }

      .navbar-username {
        display: block;
      }

      .logout-text {
        display: inline;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isDark = true;
  mobileMenuOpen = false;
  private subs: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.currentUser$.subscribe(u => this.user = u),
      this.themeService.isDark$.subscribe(d => this.isDark = d)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
  }
}
