import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../services/workout.service';
import { WorkoutPlan, WorkoutDay, LoggedExercise, WorkoutSet } from '../models/interface';

@Component({
  selector: 'app-log-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="log-workout">
      <header class="page-header">
        <h1>Log Workout</h1>
        <div class="workout-timer">
          <span class="timer-icon">⏱️</span>
          <span class="time">{{ formatTime(elapsedTime) }}</span>
        </div>
      </header>

      <div class="day-selection" *ngIf="!selectedDay">
        <h2>Select Workout Day</h2>
        <div class="day-cards">
          <div 
            class="day-card" 
            *ngFor="let day of workoutDays" 
            (click)="selectDay(day)"
          >
            <h3>{{ day.name }}</h3>
            <p class="day-badge">{{ day.day }}</p>
            <p class="exercise-count">{{ day.exercises.length }} exercises</p>
          </div>
        </div>
      </div>

      <div class="workout-logging" *ngIf="selectedDay">
        <div class="workout-header">
          <h2>{{ selectedDay.name }}</h2>
          <p class="workout-date">{{ workoutDate | date:'fullDate' }}</p>
          <button class="change-day-btn" (click)="selectedDay = null">Change Day</button>
        </div>

        <div class="exercises-log">
          <div class="exercise-card" *ngFor="let loggedExercise of loggedExercises; let i = index">
            <div class="exercise-header">
              <h3>{{ loggedExercise.name }}</h3>
              <div class="exercise-status">
                <span class="completed-sets">{{ getCompletedSets(loggedExercise) }}</span>/{{ loggedExercise.sets.length }}
              </div>
            </div>

            <div class="sets-table">
              <div class="table-header">
                <span>Set</span>
                <span>Previous</span>
                <span>Reps</span>
                <span>Weight (kg)</span>
                <span>✓</span>
              </div>
              
              <div class="set-row" *ngFor="let set of loggedExercise.sets; let j = index">
                <span class="set-number">{{ set.setNumber }}</span>
                <span class="previous-data">{{ getPreviousData(loggedExercise.exerciseId, j) }}</span>
                <input 
                  type="number" 
                  [(ngModel)]="set.reps" 
                  [name]="'reps'+i+j"
                  min="1"
                  class="reps-input"
                  (change)="updateSet(i, j)"
                />
                <input 
                  type="number" 
                  [(ngModel)]="set.weight" 
                  [name]="'weight'+i+j"
                  min="0"
                  step="0.5"
                  class="weight-input"
                  (change)="updateSet(i, j)"
                />
                <input 
                  type="checkbox" 
                  [(ngModel)]="set.completed" 
                  [name]="'completed'+i+j"
                  class="completed-checkbox"
                  (change)="updateSet(i, j)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="workout-notes">
          <label for="notes">Workout Notes (Optional)</label>
          <textarea 
            id="notes" 
            [(ngModel)]="workoutNotes" 
            placeholder="How did the workout feel? Any observations..."
            rows="3"
          ></textarea>
        </div>

        <div class="workout-actions">
          <button class="cancel-btn" (click)="cancelWorkout()">Cancel</button>
          <button 
            class="save-btn" 
            (click)="saveWorkout()"
            [disabled]="getCompletedExercises() === 0"
          >
            Save Workout ({{ getCompletedExercises() }}/{{ loggedExercises.length }} exercises)
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .log-workout {
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

    .workout-timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f3f4f6;
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
    }

    .timer-icon {
      font-size: 1.25rem;
    }

    .time {
      font-weight: 600;
      color: #1f2937;
      font-size: 1.125rem;
    }

    .day-selection {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .day-selection h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
    }

    .day-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .day-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 2px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .day-card:hover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .day-card h3 {
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .day-badge {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      display: inline-block;
      margin-bottom: 0.5rem;
    }

    .exercise-count {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    .workout-logging {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .workout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .workout-header h2 {
      color: #1f2937;
      margin: 0;
    }

    .workout-date {
      color: #6b7280;
      margin: 0;
    }

    .change-day-btn {
      padding: 0.5rem 1rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .exercise-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
      border: 1px solid #e5e7eb;
    }

    .exercise-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .exercise-header h3 {
      color: #1f2937;
      margin: 0;
    }

    .exercise-status {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .sets-table {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .table-header {
      display: grid;
      grid-template-columns: 0.5fr 1fr 1fr 1fr 0.5fr;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .set-row {
      display: grid;
      grid-template-columns: 0.5fr 1fr 1fr 1fr 0.5fr;
      gap: 0.5rem;
      padding: 0.75rem;
      border-top: 1px solid #e5e7eb;
      align-items: center;
    }

    .set-number {
      font-weight: 600;
      color: #6b7280;
    }

    .previous-data {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .reps-input, .weight-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }

    .completed-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      justify-self: center;
    }

    .workout-notes {
      margin: 2rem 0;
    }

    .workout-notes label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .workout-notes textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      resize: vertical;
      box-sizing: border-box;
    }

    .workout-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .cancel-btn {
      padding: 0.75rem 1.5rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .save-btn {
      padding: 0.75rem 1.5rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .save-btn:hover:not(:disabled) {
      background: #059669;
    }

    .save-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .log-workout {
        padding: 1rem 0.5rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .workout-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .day-cards {
        grid-template-columns: 1fr;
      }

      .table-header, .set-row {
        grid-template-columns: 0.4fr 0.8fr 0.8fr 1fr 0.4fr;
        gap: 0.25rem;
        font-size: 0.75rem;
      }

      .workout-actions {
        flex-direction: column;
      }
    }
  `]
})
export class LogWorkoutComponent implements OnInit {
  currentPlan: WorkoutPlan | null = null;
  workoutDays: WorkoutDay[] = [];
  selectedDay: WorkoutDay | null = null;
  loggedExercises: LoggedExercise[] = [];
  workoutDate = new Date();
  workoutNotes = '';
  elapsedTime = 0;
  private timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService
  ) {}

  ngOnInit(): void {
    this.currentPlan = this.workoutService.getCurrentPlan();
    if (this.currentPlan) {
      this.workoutDays = this.currentPlan.days;
      
      // Check if a specific day was selected
      const dayId = this.route.snapshot.queryParams['day'];
      if (dayId) {
        const day = this.workoutDays.find(d => d.id === dayId);
        if (day) {
          this.selectDay(day);
        }
      }
    }

    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  selectDay(day: WorkoutDay): void {
    this.selectedDay = day;
    this.loggedExercises = day.exercises.map(exercise => ({
      exerciseId: exercise.id,
      name: exercise.name,
      sets: Array.from({ length: exercise.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: exercise.reps,
        weight: exercise.weight,
        completed: false
      }))
    }));
  }

  updateSet(exerciseIndex: number, setIndex: number): void {
    // Set is automatically updated via ngModel
  }

  getPreviousData(exerciseId: string, setIndex: number): string {
    // In a real app, this would fetch previous workout data
    return '12×80'; // Placeholder
  }

  getCompletedSets(exercise: LoggedExercise): number {
    return exercise.sets.filter(set => set.completed).length;
  }

  getCompletedExercises(): number {
    return this.loggedExercises.filter(exercise => 
      exercise.sets.some(set => set.completed)
    ).length;
  }

  cancelWorkout(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.router.navigate(['/dashboard']);
  }

  saveWorkout(): void {
    if (!this.selectedDay || !this.currentPlan) return;

    const workoutLog = {
      userId: '1',
      planId: this.currentPlan.id,
      dayId: this.selectedDay.id,
      dayName: this.selectedDay.name,
      date: this.workoutDate,
      exercises: this.loggedExercises.filter(exercise => 
        exercise.sets.some(set => set.completed)
      ),
      duration: Math.floor(this.elapsedTime / 60),
      notes: this.workoutNotes || undefined
    };

    this.workoutService.logWorkout(workoutLog).subscribe(() => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.router.navigate(['/history']);
    });
  }
}