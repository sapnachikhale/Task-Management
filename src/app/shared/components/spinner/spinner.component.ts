import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrapper" [class.spinner-overlay]="overlay">
      <div class="spinner">
        <div class="spinner-ring"></div>
      </div>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-8);
    }

    .spinner-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 999;
      padding: 0;
    }

    .spinner {
      position: relative;
      width: 44px;
      height: 44px;
    }

    .spinner-ring {
      width: 44px;
      height: 44px;
      border: 3px solid var(--color-surface);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() overlay: boolean = false;
}
