import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile">
      <header class="profile-header">
        <div class="user-avatar">{{ getUserInitials() }}</div>
        <div class="user-info">
          <h1>{{ currentUser?.name }}</h1>
          <p>{{ currentUser?.email }}</p>
          <p class="member-since">Member since {{ formatDate(currentUser?.createdAt) }}</p>
        </div>
      </header>

      <div class="profile-sections">
        <div class="section">
          <h2>Account Settings</h2>
          <div class="setting-item">
            <span class="setting-label">Email Notifications</span>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">Workout Reminders</span>
            <label class="switch">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">Progress Reports</span>
            <label class="switch">
              <input type="checkbox">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="section">
          <h2>Workout Preferences</h2>
          <div class="preference-item">
            <label>Default Rest Time (seconds)</label>
            <select>
              <option value="60">60</option>
              <option value="90">90</option>
              <option value="120" selected>120</option>
              <option value="180">180</option>
            </select>
          </div>
          <div class="preference-item">
            <label>Weight Unit</label>
            <select>
              <option value="kg" selected>Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>
          <div class="preference-item">
            <label>Week Start Day</label>
            <select>
              <option value="sunday">Sunday</option>
              <option value="monday" selected>Monday</option>
            </select>
          </div>
        </div>

        <div class="section">
          <h2>Data & Privacy</h2>
          <div class="action-item">
            <div>
              <span class="action-title">Export Workout Data</span>
              <p class="action-description">Download all your workout data as a CSV file</p>
            </div>
            <button class="secondary-btn">Export</button>
          </div>
          <div class="action-item">
            <div>
              <span class="action-title">Clear Workout History</span>
              <p class="action-description">This will permanently delete all your workout logs</p>
            </div>
            <button class="danger-btn">Clear</button>
          </div>
        </div>

        <div class="section">
          <h2>About</h2>
          <div class="about-content">
            <p><strong>Workout Tracker</strong></p>
            <p>Version 1.0.0</p>
            <p>Built with Angular 20 and modern web technologies</p>
            <div class="links">
              <a href="#" class="link">Privacy Policy</a>
              <a href="#" class="link">Terms of Service</a>
              <a href="#" class="link">Support</a>
            </div>
          </div>
        </div>
      </div>

      <div class="logout-section">
        <button class="logout-btn" (click)="logout()">
          <span class="logout-icon">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile {
      padding: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .user-avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
    }

    .user-info h1 {
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .user-info p {
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }

    .member-since {
      font-size: 0.875rem;
    }

    .profile-sections {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .section {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .section h2 {
      color: #1f2937;
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-label {
      color: #374151;
      font-weight: 500;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #3b82f6;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .preference-item {
      margin-bottom: 1.5rem;
    }

    .preference-item:last-child {
      margin-bottom: 0;
    }

    .preference-item label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .preference-item select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      color: #1f2937;
      font-size: 1rem;
    }

    .action-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
      gap: 1rem;
    }

    .action-item:last-child {
      border-bottom: none;
    }

    .action-title {
      font-weight: 600;
      color: #374151;
      display: block;
      margin-bottom: 0.25rem;
    }

    .action-description {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .secondary-btn, .danger-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      white-space: nowrap;
    }

    .secondary-btn {
      background: #f3f4f6;
      color: #374151;
    }

    .secondary-btn:hover {
      background: #e5e7eb;
    }

    .danger-btn {
      background: #fee2e2;
      color: #dc2626;
    }

    .danger-btn:hover {
      background: #fecaca;
    }

    .about-content p {
      margin: 0 0 0.5rem 0;
      color: #6b7280;
    }

    .about-content p strong {
      color: #1f2937;
    }

    .links {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .link {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;
    }

    .link:hover {
      text-decoration: underline;
    }

    .logout-section {
      margin-top: 2rem;
    }

    .logout-btn {
      width: 100%;
      padding: 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    .logout-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .profile {
        padding: 1rem 0.5rem;
      }

      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .action-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .links {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
    }
  `]
})
export class ProfileComponent {
    private authService: AuthService = inject(AuthService)

  currentUser = this.authService.currentUserValue;

  constructor(
    private router: Router
  ) {}

  getUserInitials(): string {
    if (!this.currentUser?.name) return 'U';
    return this.currentUser.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}