import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPlan, WorkoutDay, Exercise } from '../../models/interface';

@Component({
  selector: 'app-workout-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-plan.component.html',
  styleUrls: ['./workout-plan.component.scss']
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