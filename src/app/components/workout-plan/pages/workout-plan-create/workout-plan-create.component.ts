import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { WorkoutService } from '../../../../services/workout.service';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../../../models/interface';

@Component({
  selector: 'app-workout-plan-create',
  standalone: true,
  imports: [],
  templateUrl: './workout-plan-create.component.html',
  styleUrl: './workout-plan-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPlanCreateComponent {
  private readonly workoutService = inject(WorkoutService);

  @Output() planCreated = new EventEmitter<WorkoutPlan>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly newPlan = signal(this.getEmptyPlan());

  private getEmptyPlan(): WorkoutPlan {
    return {
      name: '',
      days: [{}]
    } as WorkoutPlan;
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

  protected cancelCreate(): void {

  }
}
