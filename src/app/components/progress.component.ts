import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../services/workout.service';
import { ProgressData } from '../models/interface';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="progress">
      <header class="page-header">
        <h1>Progress Tracking</h1>
        <div class="exercise-selector">
          <select [(ngModel)]="selectedExercise" (change)="loadProgressData()">
            <option value="">Select Exercise</option>
            <option *ngFor="let exercise of availableExercises" [value]="exercise">
              {{ exercise }}
            </option>
          </select>
        </div>
      </header>

      <div class="progress-overview" *ngIf="selectedExercise && progressData">
        <div class="progress-stats">
          <div class="stat-card">
            <div class="stat-value">{{ getMaxWeight() }}kg</div>
            <div class="stat-label">Max Weight</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getMaxReps() }}</div>
            <div class="stat-label">Max Reps</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getImprovement() }}%</div>
            <div class="stat-label">Improvement</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getTotalSessions() }}</div>
            <div class="stat-label">Sessions</div>
          </div>
        </div>

        <div class="chart-container">
          <h2>{{ selectedExercise }} Progress</h2>
          <div class="chart-tabs">
            <button 
              class="chart-tab" 
              [class.active]="activeChart === 'weight'"
              (click)="activeChart = 'weight'"
            >
              Weight
            </button>
            <button 
              class="chart-tab" 
              [class.active]="activeChart === 'reps'"
              (click)="activeChart = 'reps'"
            >
              Reps
            </button>
          </div>

          <div class="chart" *ngIf="progressData.data.length > 0">
            <div class="chart-y-axis">
              <span *ngFor="let tick of getYAxisTicks()" class="y-tick">{{ tick }}</span>
            </div>
            <div class="chart-area">
              <svg class="chart-svg" viewBox="0 0 400 200">
                <!-- Grid lines -->
                <defs>
                  <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 25" fill="none" stroke="#f3f4f6" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                <!-- Progress line -->
                <polyline
                  [attr.points]="getChartPoints()"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <!-- Data points -->
                <circle
                  *ngFor="let point of getDataPoints(); let i = index"
                  [attr.cx]="point.x"
                  [attr.cy]="point.y"
                  r="5"
                  fill="#3b82f6"
                  stroke="white"
                  stroke-width="2"
                  class="data-point"
                  [attr.data-date]="formatDate(progressData.data[i].date)"
                  [attr.data-value]="getDisplayValue(progressData.data[i])"
                />
              </svg>
              
              <div class="chart-x-axis">
                <span *ngFor="let date of getXAxisDates()" class="x-tick">
                  {{ formatShortDate(date) }}
                </span>
              </div>
            </div>
          </div>

          <div class="empty-chart" *ngIf="progressData.data.length === 0">
            <p>No data available for this exercise yet.</p>
          </div>
        </div>

        <div class="progress-table">
          <h3>Session Details</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Reps</th>
                  <th>1RM Est.</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let session of progressData.data.reverse()">
                  <td>{{ formatDate(session.date) }}</td>
                  <td>{{ session.weight }}</td>
                  <td>{{ session.reps }}</td>
                  <td>{{ calculateOneRM(session.weight, session.reps) }}kg</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="no-exercise-selected" *ngIf="!selectedExercise">
        <h2>Track Your Progress</h2>
        <p>Select an exercise above to view your progress over time.</p>
        <div class="exercise-grid">
          <div 
            class="exercise-card" 
            *ngFor="let exercise of availableExercises.slice(0, 6)"
            (click)="selectExercise(exercise)"
          >
            <h4>{{ exercise }}</h4>
            <p>View progress</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress {
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

    .exercise-selector select {
      padding: 0.5rem 1rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      background: white;
      color: #1f2937;
      font-size: 0.875rem;
      min-width: 200px;
    }

    .progress-stats {
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

    .chart-container {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .chart-container h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .chart-tabs {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .chart-tab {
      padding: 0.5rem 1rem;
      border: 2px solid #e5e7eb;
      background: white;
      color: #6b7280;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .chart-tab.active {
      border-color: #3b82f6;
      background: #3b82f6;
      color: white;
    }

    .chart {
      display: flex;
      gap: 1rem;
      height: 250px;
    }

    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 0;
      min-width: 50px;
    }

    .y-tick {
      font-size: 0.75rem;
      color: #6b7280;
      text-align: right;
    }

    .chart-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .chart-svg {
      flex: 1;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: #f9fafb;
    }

    .data-point {
      cursor: pointer;
    }

    .data-point:hover {
      r: 7;
      fill: #2563eb;
    }

    .chart-x-axis {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      margin-top: 0.5rem;
    }

    .x-tick {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .empty-chart {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .progress-table {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .progress-table h3 {
      color: #1f2937;
      margin-bottom: 1.5rem;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      text-align: left;
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
    }

    td {
      color: #6b7280;
    }

    .no-exercise-selected {
      background: white;
      padding: 3rem 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .no-exercise-selected h2 {
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .no-exercise-selected p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    .exercise-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .exercise-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 2px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s;
    }

    .exercise-card:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .exercise-card h4 {
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .exercise-card p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .progress {
        padding: 1rem 0.5rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .progress-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .chart {
        height: 200px;
      }

      .exercise-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProgressComponent implements OnInit {
  availableExercises: string[] = [];
  selectedExercise = '';
  progressData: ProgressData | null = null;
  activeChart = 'weight';

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadAvailableExercises();
  }

  private loadAvailableExercises(): void {
    // Get unique exercises from current plan
    const currentPlan = this.workoutService.getCurrentPlan();
    if (currentPlan) {
      const exercises = new Set<string>();
      currentPlan.days.forEach(day => {
        day.exercises.forEach(exercise => {
          exercises.add(exercise.name);
        });
      });
      this.availableExercises = Array.from(exercises).sort();
    }
  }

  selectExercise(exercise: string): void {
    this.selectedExercise = exercise;
    this.loadProgressData();
  }

  loadProgressData(): void {
    if (!this.selectedExercise) return;

    this.workoutService.getProgressData(this.selectedExercise).subscribe(data => {
      this.progressData = data;
    });
  }

  getMaxWeight(): number {
    if (!this.progressData?.data.length) return 0;
    return Math.max(...this.progressData.data.map(d => d.weight));
  }

  getMaxReps(): number {
    if (!this.progressData?.data.length) return 0;
    return Math.max(...this.progressData.data.map(d => d.reps));
  }

  getImprovement(): number {
    if (!this.progressData?.data.length || this.progressData.data.length < 2) return 0;
    const first = this.progressData.data[0];
    const last = this.progressData.data[this.progressData.data.length - 1];
    const firstValue = this.activeChart === 'weight' ? first.weight : first.reps;
    const lastValue = this.activeChart === 'weight' ? last.weight : last.reps;
    return Math.round(((lastValue - firstValue) / firstValue) * 100);
  }

  getTotalSessions(): number {
    return this.progressData?.data.length || 0;
  }

  getYAxisTicks(): number[] {
    if (!this.progressData?.data.length) return [];
    const values = this.progressData.data.map(d => 
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const step = Math.ceil(range / 5);
    
    const ticks = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push(Math.round(max - (i * step)));
    }
    return ticks;
  }

  getChartPoints(): string {
    if (!this.progressData?.data.length) return '';
    
    const values = this.progressData.data.map(d => 
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const points = this.progressData.data.map((d, i) => {
      const x = (i / (this.progressData!.data.length - 1 || 1)) * 380 + 10;
      const value = this.activeChart === 'weight' ? d.weight : d.reps;
      const y = 190 - ((value - min) / range) * 180;
      return `${x},${y}`;
    });
    
    return points.join(' ');
  }

  getDataPoints(): { x: number, y: number }[] {
    if (!this.progressData?.data.length) return [];
    
    const values = this.progressData.data.map(d => 
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    return this.progressData.data.map((d, i) => {
      const x = (i / (this.progressData!.data.length - 1 || 1)) * 380 + 10;
      const value = this.activeChart === 'weight' ? d.weight : d.reps;
      const y = 190 - ((value - min) / range) * 180;
      return { x, y };
    });
  }

  getXAxisDates(): Date[] {
    if (!this.progressData?.data.length) return [];
    const data = this.progressData.data;
    if (data.length <= 4) return data.map(d => d.date);
    
    // Show max 4 dates evenly distributed
    const indices = [0, Math.floor(data.length / 3), Math.floor(2 * data.length / 3), data.length - 1];
    return indices.map(i => data[i].date);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric' 
    });
  }

  getDisplayValue(session: any): number {
    return this.activeChart === 'weight' ? session.weight : session.reps;
  }

  calculateOneRM(weight: number, reps: number): number {
    // Epley formula: 1RM = weight * (1 + reps/30)
    return Math.round(weight * (1 + reps / 30));
  }
}