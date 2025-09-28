import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { WorkoutService } from '../../../../services/workout.service';
import { Exercise, WorkoutDay, WorkoutPlan } from '../../../../models/interface';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WorkoutPlanFormGroup, WorkoutPlanFormService } from '../../services/workout-plan-form.service';
import { SupabaseService } from '../../../../services/supabase.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workout-plan-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './workout-plan-create.component.html',
  styleUrl: './workout-plan-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPlanCreateComponent implements OnInit {
  router = inject(Router);

  ngOnInit(): void {
    // get the plan id from the route and load the plan if editing
    const urlSegments = this.router.url.split('/');
    const planId = urlSegments.length > 2 ? urlSegments[2] : null;
    if (planId) {
      this.supabaseService.getWorkoutPlanById(planId).subscribe(plan => {
        console.log('Loaded plan for editing:', plan);
        if (plan) {
          this.form.patchValue(plan)
        }
      });
    }
  }
  private readonly formService = inject(WorkoutPlanFormService);

  private readonly supabaseService = inject(SupabaseService);

  form: WorkoutPlanFormGroup = this.formService.workoutPlanForm;

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
      this.supabaseService.saveWorkoutPlan(this.form.value as WorkoutPlan).subscribe({
        next: (res) => {
          // Optionally reset the form or provide user feedback here
        },
        error: (err) => {
          // Optionally provide user feedback here
        }
      });
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
