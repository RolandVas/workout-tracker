export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }
  
  export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    restTime?: number;
  }
  
  export interface WorkoutDay {
    id: string;
    name: string;
    day: string;
    exercises: Exercise[];
  }
  
  export interface WorkoutPlan {
    id: string;
    name: string;
    userId: string;
    days: WorkoutDay[];
    createdAt: Date;
  }
  
  export interface WorkoutSet {
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
  }
  
  export interface LoggedExercise {
    exerciseId: string;
    name: string;
    sets: WorkoutSet[];
  }
  
  export interface WorkoutLog {
    id: string;
    userId: string;
    planId: string;
    dayId: string;
    dayName: string;
    date: Date;
    exercises: LoggedExercise[];
    duration?: number;
    notes?: string;
  }
  
  export interface ProgressData {
    exerciseName: string;
    data: {
      date: Date;
      weight: number;
      reps: number;
    }[];
  }