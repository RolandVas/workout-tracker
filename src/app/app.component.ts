import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app">
      <div class="main-content" [class.with-nav]="showNavigation">
        <router-outlet></router-outlet>
      </div>
      
      <nav class="bottom-nav" *ngIf="showNavigation">
        <button 
          class="nav-item" 
          [class.active]="currentRoute === '/dashboard'"
          (click)="navigate('/dashboard')"
        >
          <span class="nav-icon">🏠</span>
          <span class="nav-label">Home</span>
        </button>
        <button 
          class="nav-item" 
          [class.active]="currentRoute === '/plan'"
          (click)="navigate('/plan')"
        >
          <span class="nav-icon">📋</span>
          <span class="nav-label">Plan</span>
        </button>
        <button 
          class="nav-item" 
          [class.active]="currentRoute === '/log'"
          (click)="navigate('/log')"
        >
          <span class="nav-icon">📝</span>
          <span class="nav-label">Log</span>
        </button>
        <button 
          class="nav-item" 
          [class.active]="currentRoute === '/history'"
          (click)="navigate('/history')"
        >
          <span class="nav-icon">📊</span>
          <span class="nav-label">History</span>
        </button>
        <button 
          class="nav-item" 
          [class.active]="currentRoute === '/progress'"
          (click)="navigate('/progress')"
        >
          <span class="nav-icon">📈</span>
          <span class="nav-label">Progress</span>
        </button>
        <button 
          class="nav-item" 
          [class.active]="currentRoute === '/profile'"
          (click)="navigate('/profile')"
        >
          <span class="nav-icon">👤</span>
          <span class="nav-label">Profile</span>
        </button>
      </nav>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      background: #f3f4f6;
      min-height: 100vh;
    }

    .main-content.with-nav {
      padding-bottom: 80px;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-around;
      padding: 0.5rem 0.25rem;
      box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 0.5rem;
      flex: 1;
      max-width: 80px;
    }

    .nav-item:hover {
      background: #f3f4f6;
    }

    .nav-item.active {
      background: #eff6ff;
      color: #3b82f6;
    }

    .nav-icon {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .nav-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: inherit;
    }

    .nav-item.active .nav-label {
      color: #3b82f6;
    }

    @media (min-width: 1024px) {
      .bottom-nav {
        display: none;
      }

      .main-content.with-nav {
        padding-bottom: 0;
      }
    }

    @media (max-width: 480px) {
      .nav-label {
        font-size: 0.625rem;
      }

      .nav-icon {
        font-size: 1rem;
      }

      .nav-item {
        padding: 0.375rem;
      }
    }
  `]
})
export class AppComponent {
  currentRoute = '';
  showNavigation = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check initial route
    this.updateNavigationVisibility(this.router.url);

    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.updateNavigationVisibility(event.url);
      }
    });

    // Check authentication status on app init
    if (!this.authService.isLoggedIn && this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  private updateNavigationVisibility(url: string): void {
    this.showNavigation = this.authService.isLoggedIn && url !== '/login';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
