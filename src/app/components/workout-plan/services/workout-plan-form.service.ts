import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../../models/interface';

// Typisierte FormGroups
export type ExerciseFormGroup = FormGroup<{
  id?: FormControl<string>;
  name: FormControl<string>;
  sets: FormControl<number>;
  reps: FormControl<number>;
  weight: FormControl<number>;
  restTime: FormControl<number>;
}>;

export type WorkoutDayFormGroup = FormGroup<{
  id?: FormControl<string>;
  name: FormControl<string>;
  day: FormControl<string>;
  exercises: FormArray<ExerciseFormGroup>;
}>;

export type WorkoutPlanFormGroup = FormGroup<{
  id?: FormControl<string>;
  name: FormControl<string>;
  userId: FormControl<string>;
  days: FormArray<WorkoutDayFormGroup>;
  createdAt: FormControl<Date>;
}>;

@Injectable({
    providedIn: 'root'
})
export class WorkoutPlanFormService {
  private fb: NonNullableFormBuilder = inject(NonNullableFormBuilder)

  workoutPlanForm: WorkoutPlanFormGroup = this.fb.group({
    name: this.fb.control('Push-pull', Validators.required),
    userId: this.fb.control(''),
    days: this.fb.array([this.createWorkoutDayForm()]),
    createdAt: this.fb.control(new Date()),
  });

    createWorkoutDayForm(): WorkoutDayFormGroup {
        return this.fb.group({
            name: this.fb.control('Push', Validators.required),
            day: this.fb.control('monday', Validators.required),
            exercises: this.fb.array([this.createExerciseForm()]),
        });
    }

    createExerciseForm(): ExerciseFormGroup {
        return this.fb.group({
            name: this.fb.control('bizeps', Validators.required),
            sets: this.fb.control(0, Validators.required),
            reps: this.fb.control(0, Validators.required),
            weight: this.fb.control(0),
            restTime: this.fb.control(0),
        });
    }
}
