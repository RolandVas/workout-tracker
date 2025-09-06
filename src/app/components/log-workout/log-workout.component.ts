import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPlan, WorkoutDay, LoggedExercise, WorkoutSet } from '../../models/interface';

@Component({
  selector: 'app-log-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-workout.component.html',
  styleUrls: ['./log-workout.component.scss']
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