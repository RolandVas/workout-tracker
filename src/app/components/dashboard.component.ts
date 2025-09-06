import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../services/workout.service';
import { AuthService } from '../services/auth.service';
import { WorkoutLog, WorkoutPlan } from '../models/interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Welcome back, {{ currentUser?.name }}!</h1>
        <p class="date">{{ today | date:'EEEE, MMMM d, y' }}</p>
      </header>

      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-value">{{ recentLogs.length }}</div>
          <div class="stat-label">Workouts this week</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ currentPlan?.days?.length || 0 }}</div>
          <div class="stat-label">Days in plan</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalExercises() }}</div>
          <div class="stat-label">Total exercises</div>
        </div>
      </div>

      <div class="today-workout" *ngIf="todaysWorkout">
        <h2>Today's Workout: {{ todaysWorkout.name }}</h2>
        <div class="exercise-list">
          <div class="exercise-item" *ngFor="let exercise of todaysWorkout.exercises">
            <span class="exercise-name">{{ exercise.name }}</span>
            <span class="exercise-details">{{ exercise.sets }}×{{ exercise.reps }} X {{ exercise.weight }}kg</span>
          </div>
        </div>
        <button class="start-workout-btn" (click)="startWorkout()">
          Start Workout
        </button>
      </div>

      <div class="recent-workouts">
        <h2>Recent Workouts</h2>
        <div class="workout-history" *ngIf="recentLogs.length > 0">
          <div class="workout-item" *ngFor="let log of recentLogs.slice(0, 3)">
            <div class="workout-info">
              <div class="workout-name">{{ log.dayName }}</div>
              <div class="workout-date">{{ log.date | date:'MMM d, y' }}</div>
            </div>
            <div class="workout-stats">
              <span>{{ log.exercises.length }} exercises</span>
              <span>{{ log.duration }}min</span>
            </div>
          </div>
        </div>
        <div class="empty-state" *ngIf="recentLogs.length === 0">
          <p>No workouts logged yet. Start your fitness journey!</p>
        </div>
      </div>

      <div class="quick-actions">
        <button class="action-btn primary" (click)="router.navigate(['/log'])">
          <span class="btn-icon">📝</span>
          Log Workout
        </button>
        <button class="action-btn secondary" (click)="router.navigate(['/plan'])">
          <span class="btn-icon">📋</span>
          View Plan
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      color: #1f2937;
      margin-bottom: 0.5rem;
      font-size: 1.875rem;
      font-weight: 700;
    }

    .date {
      color: #6b7280;
      font-size: 1rem;
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .today-workout, .recent-workouts {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .today-workout h2, .recent-workouts h2 {
      color: #1f2937;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .exercise-list {
      margin-bottom: 1.5rem;
    }

    .exercise-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .exercise-name {
      font-weight: 500;
      color: #1f2937;
    }

    .exercise-details {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .start-workout-btn {
      width: 100%;
      padding: 0.75rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .start-workout-btn:hover {
      background: #059669;
    }

    .workout-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 2px solid #f3f4f6;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .workout-name {
      font-weight: 600;
      color: #1f2937;
    }

    .workout-date {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .workout-stats {
      display: flex;
      gap: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .action-btn {
      padding: 1rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .action-btn.primary {
      background: #3b82f6;
      color: white;
    }

    .action-btn.primary:hover {
      background: #2563eb;
    }

    .action-btn.secondary {
      background: #f3f4f6;
      color: #1f2937;
    }

    .action-btn.secondary:hover {
      background: #e5e7eb;
    }

    .btn-icon {
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem 0.5rem;
      }

      .quick-stats {
        grid-template-columns: repeat(3, 1fr);
      }

      .stat-card {
        padding: 1rem;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .workout-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .workout-stats {
        gap: 0.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
    private authService: AuthService = inject(AuthService)

  currentUser = this.authService.currentUserValue;
  currentPlan: WorkoutPlan | null = null;
  recentLogs: WorkoutLog[] = [];
  todaysWorkout: any = null;
  today = new Date();

  constructor(
    public router: Router,
    private workoutService: WorkoutService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.workoutService.getWorkoutLogs().subscribe(logs => {
      this.recentLogs = logs.filter(log => 
        new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    });

    this.currentPlan = this.workoutService.getCurrentPlan();
    
    // Get today's workout based on day of week
    if (this.currentPlan) {
      const todayName = this.today.toLocaleDateString('en-US', { weekday: 'long' });
      this.todaysWorkout = this.currentPlan.days.find(day => day.day === todayName);
    }
  }

  getTotalExercises(): number {
    if (!this.currentPlan) return 0;
    return this.currentPlan.days.reduce((total, day) => total + day.exercises.length, 0);
  }

  startWorkout(): void {
    this.router.navigate(['/log'], { 
      queryParams: { day: this.todaysWorkout?.id } 
    });
  }
}