import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { WorkoutService } from '../../../../services/workout.service';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../../../models/interface';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WorkoutPlanFormGroup, WorkoutPlanFormService } from '../../services/workout-plan-form.service';

@Component({
  selector: 'app-workout-plan-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './workout-plan-create.component.html',
  styleUrl: './workout-plan-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPlanCreateComponent {
  private readonly formService = inject(WorkoutPlanFormService);

  form: WorkoutPlanFormGroup;

  constructor() {
    this.form = this.formService.createWorkoutPlanForm();
  }

//   getDayExercises(day: ): FormArray {
//   return (day.get('exercises') as FormArray);
// }

  // get days(): FormArray {
  //   return this.form.get('days') as FormArray;
  // }

  addDay() {
    this.form.controls.days.push(this.formService.createWorkoutDayForm());
  }

  removeDay(index: number) {
    this.form.controls.days.removeAt(index);
  }

  addExercise(dayIndex: number) {
    const day = this.form.controls.days.at(dayIndex) as FormGroup;
    const exercises = day.get('exercises') as FormArray;
    exercises.push(this.formService.createExerciseForm());
  }

  removeExercise(dayIndex: number, exIndex: number) {
    const day = this.form.controls.days.at(dayIndex) as FormGroup;
    const exercises = day.get('exercises') as FormArray;
    exercises.removeAt(exIndex);
  }

  submit() {
    console.log(this.form.value);
    if (this.form.valid) {
      
      // → entspricht WorkoutPlan
    }
  }



  // ---------------------------------------------------------------------------------
  // private readonly workoutService = inject(WorkoutService);

  // @Output() planCreated = new EventEmitter<WorkoutPlan>();
  // @Output() cancel = new EventEmitter<void>();

  // protected readonly newPlan = signal(this.getEmptyPlan());

  // private getEmptyPlan(): WorkoutPlan {
  //   return {
  //     name: '',
  //     days: [{}]
  //   } as WorkoutPlan;
  // }

  // protected addDay(): void {

  // }

  // protected removeDay(index: number): void {

  // }

  // protected addExercise(dayIndex: number): void {

  // }

  // protected removeExercise(dayIndex: number, exerciseIndex: number): void {

  // }

  // protected updatePlanField(field: keyof WorkoutPlan, value: unknown): void {

  // }

  // protected updateDayField(dayIndex: number, field: keyof WorkoutDay, value: unknown): void {

  // }

  // protected updateExerciseField(dayIndex: number, exerciseIndex: number, field: keyof Exercise, value: unknown): void {

  // }

  // protected createPlan(): void {

  // }

  // protected cancelCreate(): void {

  // }
}
