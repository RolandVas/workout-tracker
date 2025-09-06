import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../services/workout.service';
import { WorkoutPlan, WorkoutDay, Exercise } from '../models/interface';

@Component({
  selector: 'app-workout-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="workout-plan">
      <header class="page-header">
        <h1>Workout Plan</h1>
        <button class="create-btn" (click)="showCreateForm = !showCreateForm">
          {{ showCreateForm ? 'Cancel' : 'Create New Plan' }}
        </button>
      </header>

      <div class="create-form" *ngIf="showCreateForm">
        <h2>Create New Workout Plan</h2>
        <form (ngSubmit)="createPlan()">
          <div class="form-group">
            <label>Plan Name</label>
            <input type="text" [(ngModel)]="newPlan.name" name="planName" required>
          </div>
          
          <div class="days-section">
            <h3>Workout Days</h3>
            <div class="day-form" *ngFor="let day of newPlan.days; let i = index">
              <div class="day-header">
                <input type="text" [(ngModel)]="day.name" [name]="'dayName'+i" placeholder="Day name (e.g., Push Day)">
                <select [(ngModel)]="day.day" [name]="'daySelect'+i">
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <button type="button" class="remove-day-btn" (click)="removeDay(i)">Remove</button>
              </div>
              
              <div class="exercises-section">
                <h4>Exercises</h4>
                <div class="exercise-form" *ngFor="let exercise of day.exercises; let j = index">
                  <input type="text" [(ngModel)]="exercise.name" [name]="'exerciseName'+i+j" placeholder="Exercise name">
                  <input type="number" [(ngModel)]="exercise.sets" [name]="'sets'+i+j" placeholder="Sets" min="1">
                  <input type="number" [(ngModel)]="exercise.reps" [name]="'reps'+i+j" placeholder="Reps" min="1">
                  <input type="number" [(ngModel)]="exercise.weight" [name]="'weight'+i+j" placeholder="Weight (kg)" min="0">
                  <button type="button" class="remove-exercise-btn" (click)="removeExercise(i, j)">×</button>
                </div>
                <button type="button" class="add-exercise-btn" (click)="addExercise(i)">+ Add Exercise</button>
              </div>
            </div>
            <button type="button" class="add-day-btn" (click)="addDay()">+ Add Workout Day</button>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" (click)="showCreateForm = false">Cancel</button>
            <button type="submit" class="save-btn">Create Plan</button>
          </div>
        </form>
      </div>

      <div class="current-plan" *ngIf="currentPlan && !showCreateForm">
        <h2>{{ currentPlan.name }}</h2>
        <div class="plan-days">
          <div class="day-card" *ngFor="let day of currentPlan.days">
            <div class="day-header-card">
              <h3>{{ day.name }}</h3>
              <span class="day-badge">{{ day.day }}</span>
            </div>
            <div class="exercises">
              <div class="exercise" *ngFor="let exercise of day.exercises">
                <div class="exercise-name">{{ exercise.name }}</div>
                <div class="exercise-details">
                  {{ exercise.sets }} sets × {{ exercise.reps }} reps
                  <span *ngIf="exercise.weight > 0"> &#64; {{ exercise.weight }}kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!currentPlan && !showCreateForm">
        <h2>No Workout Plan Yet</h2>
        <p>Create your first workout plan to get started!</p>
        <button class="create-first-btn" (click)="showCreateForm = true">Create Your First Plan</button>
      </div>
    </div>
  `,
  styles: [`
    .workout-plan {
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

    .create-btn, .create-first-btn {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .create-btn:hover, .create-first-btn:hover {
      background: #2563eb;
    }

    .create-form {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .create-form h2 {
      color: #1f2937;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-group input, select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .days-section {
      margin-top: 2rem;
    }

    .days-section h3 {
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .day-form {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
    }

    .day-header {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .remove-day-btn, .remove-exercise-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .exercises-section h4 {
      color: #374151;
      margin-bottom: 0.75rem;
    }

    .exercise-form {
      display: grid;
      grid-template-columns: 2fr 0.5fr 0.5fr 0.75fr auto;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      align-items: center;
    }

    .add-exercise-btn, .add-day-btn {
      padding: 0.5rem 1rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
    }

    .add-day-btn {
      margin-top: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
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
    }

    .current-plan {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .current-plan h2 {
      color: #1f2937;
      margin-bottom: 2rem;
    }

    .plan-days {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .day-card {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 2px solid #e5e7eb;
    }

    .day-header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .day-header-card h3 {
      color: #1f2937;
      margin: 0;
    }

    .day-badge {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .exercise {
      padding: 0.75rem;
      background: white;
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
      border: 1px solid #e5e7eb;
    }

    .exercise-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .exercise-details {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-state h2 {
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .workout-plan {
        padding: 1rem 0.5rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .day-header {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .exercise-form {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }

      .plan-days {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorkoutPlanComponent implements OnInit {
  currentPlan: WorkoutPlan | null = null;
  showCreateForm = false;
  newPlan = this.getEmptyPlan();

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.currentPlan = this.workoutService.getCurrentPlan();
  }

  private getEmptyPlan(): any {
    return {
      name: '',
      days: [{
        name: '',
        day: '',
        exercises: [{
          name: '',
          sets: 3,
          reps: 12,
          weight: 0
        }]
      }]
    };
  }

  addDay(): void {
    this.newPlan.days.push({
      name: '',
      day: '',
      exercises: [{
        name: '',
        sets: 3,
        reps: 12,
        weight: 0
      }]
    });
  }

  removeDay(index: number): void {
    this.newPlan.days.splice(index, 1);
  }

  addExercise(dayIndex: number): void {
    this.newPlan.days[dayIndex].exercises.push({
      name: '',
      sets: 3,
      reps: 12,
      weight: 0
    });
  }

  removeExercise(dayIndex: number, exerciseIndex: number): void {
    this.newPlan.days[dayIndex].exercises.splice(exerciseIndex, 1);
  }

  createPlan(): void {
    // Generate IDs for the plan structure
    const planToCreate = {
      ...this.newPlan,
      userId: '1',
      days: this.newPlan.days.map((day: any) => ({
        ...day,
        id: Date.now().toString() + Math.random(),
        exercises: day.exercises.map((exercise: any) => ({
          ...exercise,
          id: Date.now().toString() + Math.random()
        }))
      }))
    };

    this.workoutService.createWorkoutPlan(planToCreate).subscribe(plan => {
      this.currentPlan = plan;
      this.showCreateForm = false;
      this.newPlan = this.getEmptyPlan();
    });
  }
}