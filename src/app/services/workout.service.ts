import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WorkoutPlan, WorkoutLog, WorkoutDay, Exercise, ProgressData } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workoutPlans: WorkoutPlan[] = [];
  private workoutLogs: WorkoutLog[] = [];
  private currentPlanSubject = new BehaviorSubject<WorkoutPlan | null>(null);
  public currentPlan$ = this.currentPlanSubject.asObservable();

  constructor() {
    this.initializeDummyData();
  }

  private initializeDummyData(): void {
    const dummyPlan: WorkoutPlan = {
      id: '1',
      name: 'Push Pull Legs',
      userId: '1',
      createdAt: new Date(),
      days: [
        {
          id: '1',
          name: 'Push Day',
          day: 'Monday',
          exercises: [
            { id: '1', name: 'Bench Press', sets: 3, reps: 12, weight: 80 },
            { id: '2', name: 'Overhead Press', sets: 3, reps: 10, weight: 50 },
            { id: '3', name: 'Tricep Dips', sets: 3, reps: 15, weight: 0 }
          ]
        },
        {
          id: '2',
          name: 'Pull Day',
          day: 'Wednesday',
          exercises: [
            { id: '4', name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
            { id: '5', name: 'Barbell Rows', sets: 3, reps: 12, weight: 70 },
            { id: '6', name: 'Bicep Curls', sets: 3, reps: 15, weight: 20 }
          ]
        },
        {
          id: '3',
          name: 'Leg Day',
          day: 'Friday',
          exercises: [
            { id: '7', name: 'Squats', sets: 3, reps: 12, weight: 100 },
            { id: '8', name: 'Deadlifts', sets: 3, reps: 8, weight: 120 },
            { id: '9', name: 'Leg Press', sets: 3, reps: 15, weight: 200 }
          ]
        }
      ]
    };

    this.workoutPlans.push(dummyPlan);
    this.currentPlanSubject.next(dummyPlan);

    // Add some dummy workout logs
    this.generateDummyLogs();
  }

  private generateDummyLogs(): void {
    const dates = [
      new Date(2024, 11, 2),
      new Date(2024, 11, 4),
      new Date(2024, 11, 6),
      new Date(2024, 11, 9),
      new Date(2024, 11, 11),
      new Date(2024, 11, 13)
    ];

    dates.forEach((date, index) => {
      const dayIndex = index % 3;
      const plan = this.workoutPlans[0];
      const day = plan.days[dayIndex];
      
      const log: WorkoutLog = {
        id: Date.now().toString() + index,
        userId: '1',
        planId: plan.id,
        dayId: day.id,
        dayName: day.name,
        date: date,
        exercises: day.exercises.map(exercise => ({
          exerciseId: exercise.id,
          name: exercise.name,
          sets: Array.from({ length: 3 }, (_, setIndex) => ({
            setNumber: setIndex + 1,
            reps: exercise.reps + Math.floor(Math.random() * 3) - 1,
            weight: exercise.weight + Math.floor(Math.random() * 10) - 5,
            completed: true
          }))
        })),
        duration: 45 + Math.floor(Math.random() * 30)
      };

      this.workoutLogs.push(log);
    });
  }

  getWorkoutPlans(): Observable<WorkoutPlan[]> {
    return of(this.workoutPlans);
  }

  createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdAt'>): Observable<WorkoutPlan> {
    const newPlan: WorkoutPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this.workoutPlans.push(newPlan);
    this.currentPlanSubject.next(newPlan);
    return of(newPlan);
  }

  logWorkout(workoutLog: Omit<WorkoutLog, 'id'>): Observable<WorkoutLog> {
    const newLog: WorkoutLog = {
      ...workoutLog,
      id: Date.now().toString()
    };
    
    this.workoutLogs.push(newLog);
    return of(newLog);
  }

  getWorkoutLogs(): Observable<WorkoutLog[]> {
    return of(this.workoutLogs.sort((a, b) => b.date.getTime() - a.date.getTime()));
  }

  getProgressData(exerciseName: string): Observable<ProgressData> {
    const exerciseLogs = this.workoutLogs
      .flatMap(log => log.exercises.filter(ex => ex.name === exerciseName))
      .map((ex, index) => ({
        date: this.workoutLogs[index]?.date || new Date(),
        weight: Math.max(...ex.sets.map(set => set.weight)),
        reps: Math.max(...ex.sets.map(set => set.reps))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return of({
      exerciseName,
      data: exerciseLogs
    });
  }

  getCurrentPlan(): WorkoutPlan | null {
    return this.currentPlanSubject.value;
  }
}