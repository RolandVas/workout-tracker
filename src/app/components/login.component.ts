import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Workout Tracker</h1>
        <div class="tabs">
          <button 
            class="tab-button" 
            [class.active]="isLoginMode" 
            (click)="isLoginMode = true"
          >
            Login
          </button>
          <button 
            class="tab-button" 
            [class.active]="!isLoginMode" 
            (click)="isLoginMode = false"
          >
            Sign Up
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" #form="ngForm">
          <div class="form-group" *ngIf="!isLoginMode">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              [(ngModel)]="formData.name"
              required
              placeholder="Enter your name"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="formData.email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              [(ngModel)]="formData.password"
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            class="submit-button"
            [disabled]="!form.form.valid || isLoading"
          >
            <span *ngIf="isLoading">Loading...</span>
            <span *ngIf="!isLoading">{{ isLoginMode ? 'Login' : 'Sign Up' }}</span>
          </button>
        </form>

        <div class="demo-note">
          <p><strong>Demo Mode:</strong> Use any email/password to sign in</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #1f2937;
      margin-bottom: 2rem;
      font-size: 1.875rem;
      font-weight: 700;
    }

    .tabs {
      display: flex;
      margin-bottom: 2rem;
      background: #f3f4f6;
      border-radius: 0.5rem;
      padding: 0.25rem;
    }

    .tab-button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      background: transparent;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-button.active {
      background: white;
      color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-button:hover:not(:disabled) {
      background: #2563eb;
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .demo-note {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 0.5rem;
      text-align: center;
    }

    .demo-note p {
      margin: 0;
      color: #92400e;
      font-size: 0.875rem;
    }
  `]
})
export class LoginComponent {
  isLoginMode = true;
  isLoading = false;
  formData = {
    email: '',
    password: '',
    name: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    
    const authObservable = this.isLoginMode
      ? this.authService.login(this.formData.email, this.formData.password)
      : this.authService.register(this.formData.email, this.formData.password, this.formData.name);

    authObservable.subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}