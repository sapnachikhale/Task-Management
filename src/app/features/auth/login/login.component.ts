import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <!-- Animated background shapes -->
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <div class="login-container animate-scale-in">
        <div class="login-card glass-card-static">
          <div class="login-header">
            <h1 class="login-title">
              <span class="gradient-text">TaskFlow</span>
            </h1>
            <p class="login-subtitle">Sign in to your dashboard</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
            <div class="form-group">
              <label class="form-label" for="email">Email Address</label>
              <input
                id="email"
                type="email"
                class="form-input"
                formControlName="email"
                placeholder="you@example.com"
                autocomplete="email"
                [class.ng-invalid]="loginForm.get('email')?.invalid"
                [class.ng-touched]="loginForm.get('email')?.touched"
              />
              <span class="form-error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Please enter a valid email
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                id="password"
                type="password"
                class="form-input"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
                [class.ng-invalid]="loginForm.get('password')?.invalid"
                [class.ng-touched]="loginForm.get('password')?.touched"
              />
              <span class="form-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </span>
            </div>

            <div class="login-error animate-slide-up" *ngIf="errorMessage">
              <span class="error-icon">⚠</span>
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg login-submit"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="login-spinner"></span>
            </button>
          </form>

          <div class="login-footer">
            <p class="demo-hint">
              <span class="hint-icon">💡</span>
              Demo: <strong>admin&#64;taskflow.com</strong> / <strong>password123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: var(--color-bg-primary);
    }

    /* Animated background */
    .bg-shapes {
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: 0;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      background: var(--color-accent);
      top: -100px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      background: #818CF8;
      bottom: -50px;
      left: -50px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .shape-3 {
      width: 200px;
      height: 200px;
      background: #A78BFA;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: float 6s ease-in-out infinite 2s;
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      padding: var(--space-4);
    }

    .login-card {
      padding: var(--space-10);
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .login-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      margin-bottom: var(--space-2);
    }

    .login-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .login-error {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--color-danger-bg);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--radius-md);
      color: var(--color-danger);
      font-size: var(--font-size-sm);
    }

    .error-icon {
      flex-shrink: 0;
    }

    .login-submit {
      width: 100%;
      margin-top: var(--space-2);
      height: 48px;
    }

    .login-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    .login-footer {
      margin-top: var(--space-6);
      text-align: center;
    }

    .demo-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--color-surface);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      flex-wrap: wrap;
    }

    .demo-hint strong {
      color: var(--color-text-secondary);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: var(--space-6);
      }

      .login-title {
        font-size: var(--font-size-3xl);
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themeService.init();

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
