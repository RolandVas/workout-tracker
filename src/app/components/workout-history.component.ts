import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../services/workout.service';
import { WorkoutLog } from '../models/interface';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="workout-history">
      <header class="page-header">
        <h1>Workout History</h1>
        <div class="filter-controls">
          <select [(ngModel)]="selectedFilter" (change)="applyFilter()">
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
      </header>

      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-value">{{ filteredLogs.length }}</div>
          <div class="stat-label">Total Workouts</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalDuration() }}h</div>
          <div class="stat-label">Time Spent</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getUniqueExercises() }}</div>
          <div class="stat-label">Unique Exercises</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getAverageWorkout() }}min</div>
          <div class="stat-label">Avg Duration</div>
        </div>
      </div>

      <div class="workout-list" *ngIf="filteredLogs.length > 0">
        <div class="workout-item" *ngFor="let log of filteredLogs">
          <div class="workout-header" (click)="toggleExpanded(log.id)">
            <div class="workout-info">
              <h3>{{ log.dayName }}</h3>
              <p class="workout-date">{{ log.date | date:'MMM d, y - EEEE' }}</p>
            </div>
            <div class="workout-summary">
              <span class="duration">{{ log.duration }}min</span>
              <span class="exercise-count">{{ log.exercises.length }} exercises</span>
              <span class="expand-icon" [class.rotated]="expandedWorkouts.has(log.id)">▼</span>
            </div>
          </div>

          <div class="workout-details" *ngIf="expandedWorkouts.has(log.id)">
            <div class="exercise-details" *ngFor="let exercise of log.exercises">
              <h4>{{ exercise.name }}</h4>
              <div class="sets-summary">
                <div class="set-item" *ngFor="let set of exercise.sets">
                  <span class="set-label">Set {{ set.setNumber }}:</span>
                  <span class="set-data">{{ set.reps }} reps X {{ set.weight }}kg</span>
                  <span class="completed-badge" *ngIf="set.completed">✓</span>
                </div>
              </div>
            </div>
            <div class="workout-notes" *ngIf="log.notes">
              <h4>Notes:</h4>
              <p>{{ log.notes }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredLogs.length === 0">
        <h2>No Workouts Found</h2>
        <p *ngIf="selectedFilter === 'all'">You haven't logged any workouts yet.</p>
        <p *ngIf="selectedFilter !== 'all'">No workouts found for the selected time period.</p>
        <button class="start-workout-btn" (click)="navigateToLog()">Log Your First Workout</button>
      </div>

      <div class="workout-calendar" *ngIf="workoutLogs.length > 0">
        <h2>Workout Calendar</h2>
        <div class="calendar-grid">
          <div class="calendar-day" *ngFor="let day of getCalendarDays()">
            <span class="day-number">{{ day.date.getDate() }}</span>
            <div class="workout-indicator" *ngIf="day.hasWorkout" [title]="day.workoutName"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workout-history {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      color: #1f2937;
      font-size: 1.875rem;
      font-weight: 700;
      margin: 0;
    }

    .filter-controls select {
      padding: 0.5rem 1rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      color: #1f2937;
      font-size: 0.875rem;
    }

    .stats-overview {
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

    .workout-list {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .workout-item {
      border-bottom: 1px solid #f3f4f6;
    }

    .workout-item:last-child {
      border-bottom: none;
    }

    .workout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .workout-header:hover {
      background: #f9fafb;
    }

    .workout-info h3 {
      color: #1f2937;
      margin: 0 0 0.25rem 0;
      font-size: 1.125rem;
    }

    .workout-date {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    .workout-summary {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .expand-icon {
      transition: transform 0.2s;
      font-size: 0.75rem;
    }

    .expand-icon.rotated {
      transform: rotate(180deg);
    }

    .workout-details {
      padding: 0 1.5rem 1.5rem 1.5rem;
      background: #f9fafb;
      border-top: 1px solid #f3f4f6;
    }

    .exercise-details {
      margin-bottom: 1.5rem;
    }

    .exercise-details h4 {
      color: #1f2937;
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
    }

    .sets-summary {
      display: grid;
      gap: 0.5rem;
    }

    .set-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .set-label {
      font-weight: 500;
      color: #6b7280;
      min-width: 60px;
    }

    .set-data {
      color: #1f2937;
    }

    .completed-badge {
      margin-left: auto;
      color: #10b981;
      font-weight: 600;
    }

    .workout-notes {
      margin-top: 1rem;
      padding: 1rem;
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-radius: 0.5rem;
    }

    .workout-notes h4 {
      color: #92400e;
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .workout-notes p {
      color: #92400e;
      margin: 0;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .empty-state h2 {
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .start-workout-btn {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .start-workout-btn:hover {
      background: #2563eb;
    }

    .workout-calendar {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .workout-calendar h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
      max-width: 400px;
      margin: 0 auto;
    }

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
      border-radius: 0.375rem;
      position: relative;
      font-size: 0.875rem;
    }

    .day-number {
      color: #6b7280;
      font-weight: 500;
    }

    .workout-indicator {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .workout-history {
        padding: 1rem 0.5rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
      }

      .workout-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .workout-summary {
        align-self: stretch;
        justify-content: space-between;
      }

      .sets-summary {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorkoutHistoryComponent implements OnInit {
  workoutLogs: WorkoutLog[] = [];
  filteredLogs: WorkoutLog[] = [];
  selectedFilter = 'all';
  expandedWorkouts = new Set<string>();

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkoutHistory();
  }

  private loadWorkoutHistory(): void {
    this.workoutService.getWorkoutLogs().subscribe(logs => {
      this.workoutLogs = logs;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const now = new Date();
    const filterDate = new Date();

    switch (this.selectedFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      default:
        filterDate.setFullYear(2020); // Show all
    }

    this.filteredLogs = this.workoutLogs.filter(log => 
      new Date(log.date) >= filterDate
    );
  }

  toggleExpanded(workoutId: string): void {
    if (this.expandedWorkouts.has(workoutId)) {
      this.expandedWorkouts.delete(workoutId);
    } else {
      this.expandedWorkouts.add(workoutId);
    }
  }

  getTotalDuration(): number {
    const totalMinutes = this.filteredLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return Math.round(totalMinutes / 60 * 10) / 10; // Convert to hours, 1 decimal
  }

  getUniqueExercises(): number {
    const exerciseNames = new Set();
    this.filteredLogs.forEach(log => {
      log.exercises.forEach(exercise => {
        exerciseNames.add(exercise.name);
      });
    });
    return exerciseNames.size;
  }

  getAverageWorkout(): number {
    if (this.filteredLogs.length === 0) return 0;
    const totalDuration = this.filteredLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return Math.round(totalDuration / this.filteredLogs.length);
  }

  getCalendarDays(): any[] {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const days = [];
    const workoutDates = new Map();
    
    // Map workout dates
    this.workoutLogs.forEach(log => {
      const dateKey = new Date(log.date).toDateString();
      workoutDates.set(dateKey, log.dayName);
    });

    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
      const dateKey = currentDate.toDateString();
      
      days.push({
        date: currentDate,
        hasWorkout: workoutDates.has(dateKey),
        workoutName: workoutDates.get(dateKey) || ''
      });
    }

    return days;
  }

  navigateToLog(): void {
    // In a real app, this would use Router
    window.location.hash = '/log';
  }
}