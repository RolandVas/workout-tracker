import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../../models/interface';

// Typisierte FormGroups
export type ExerciseFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  sets: FormControl<number>;
  reps: FormControl<number>;
  weight: FormControl<number>;
  restTime: FormControl<number | null>;
}>;

export type WorkoutDayFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  day: FormControl<string>;
  exercises: FormArray<ExerciseFormGroup>;
}>;

export type WorkoutPlanFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  userId: FormControl<string>;
  days: FormArray<WorkoutDayFormGroup>;
  createdAt: FormControl<Date>;
}>;

@Injectable({
    providedIn: 'root'
})
export class WorkoutPlanFormService {
    private fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;

    createWorkoutPlanForm(plan?: Partial<WorkoutPlan>): WorkoutPlanFormGroup {
        return this.fb.group({
            id: this.fb.control(plan?.id ?? crypto.randomUUID()),
            name: this.fb.control(plan?.name ?? '', Validators.required),
            userId: this.fb.control(plan?.userId ?? ''),
            days: this.fb.array(
                (plan?.days ?? []).map((d) => this.createWorkoutDayForm(d))
            ),
            createdAt: this.fb.control(plan?.createdAt ?? new Date()),
        });
    }

    createWorkoutDayForm(day?: Partial<WorkoutDay>): WorkoutDayFormGroup {
        return this.fb.group({
            id: this.fb.control(day?.id ?? crypto.randomUUID()),
            name: this.fb.control(day?.name ?? '', Validators.required),
            day: this.fb.control(day?.day ?? '', Validators.required),
            exercises: this.fb.array(
                (day?.exercises ?? []).map((ex) => this.createExerciseForm(ex))
            ),
        });
    }

    createExerciseForm(exercise?: Partial<Exercise>): ExerciseFormGroup {
        return this.fb.group({
            id: this.fb.control(exercise?.id ?? crypto.randomUUID()),
            name: this.fb.control(exercise?.name ?? '', Validators.required),
            sets: this.fb.control(exercise?.sets ?? 3, Validators.required),
            reps: this.fb.control(exercise?.reps ?? 10, Validators.required),
            weight: this.fb.control(exercise?.weight ?? 0),
            restTime: this.fb.control(exercise?.restTime ?? null),
        });
    }
}