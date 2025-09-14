import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPlan, WorkoutDay, Exercise } from '../../models/interface';
import { WorkoutPlanPresenterComponent } from "./components/workout-plan-presenter/workout-plan-presenter.component";
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-workout-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoutPlanPresenterComponent, RouterOutlet],
  templateUrl: './workout-plan.component.html',
  styleUrls: ['./workout-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPlanComponent {
  private readonly workoutService = inject(WorkoutService);
  private router: Router = inject(Router);

  protected readonly showCreateForm = signal(false);
  protected readonly newPlan = signal(this.getEmptyPlan());
  protected readonly currentPlan = signal<WorkoutPlan | null>(null);

  constructor() {
    this.currentPlan.set(this.workoutService.getCurrentPlan());
  }

  public navigateToCreate(): void {
    if (!this.showCreateForm()) {
    this.showCreateForm.set(true);
    this.newPlan.set(this.getEmptyPlan());
    this.router.navigate(['/plan/create']);
    } else {
      this.showCreateForm.set(false);
      this.router.navigate(['/plan']);
    }
  }

  private getEmptyPlan(): WorkoutPlan {
    return {
      name: '',
      days: [{
        name: '',
        day: '',
        exercises: [{
          id: Date.now().toString() + Math.random(),
          name: '',
          sets: 3,
          reps: 12,
          weight: 0
        }]
      }]
    } as WorkoutPlan;
  }

  protected toggleCreateForm(): void {
    this.showCreateForm.update(v => !v);
  }

  protected addDay(): void {
  }

  protected removeDay(index: number): void {

  }

  protected addExercise(dayIndex: number): void {

  }

  protected removeExercise(dayIndex: number, exerciseIndex: number): void {

  }

  protected updatePlanField(field: keyof WorkoutPlan, value: unknown): void {

  }

  protected updateDayField(dayIndex: number, field: keyof WorkoutDay, value: unknown): void {

  }

  protected updateExerciseField(dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: unknown): void {

  }

  protected createPlan(): void {
  }
}