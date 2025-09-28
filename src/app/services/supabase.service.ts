import { inject, Injectable } from '@angular/core'
import { createClient, PostgrestSingleResponse } from '@supabase/supabase-js'
import { format } from 'path'
import { from, map, Observable, switchMap } from 'rxjs'
import { environment } from '../../environments/environment.development'
import { Database } from '../../types/database.types'
import { v4 as uuidv4 } from 'uuid'
import { AuthService } from './auth.service'
import { UserService } from './user.service'

export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime?: number;
}

export interface WorkoutDay {
  id?: string;
  name: string;
  day: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id?: string;
  userId: string;
  name: string;
  createdAt?: Date;
  days: WorkoutDay[];
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly userService: UserService = inject(UserService)

  supabase = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseKey,
  )

  saveWorkoutPlan(plan: WorkoutPlan) {
    const userId = this.userService.currentUser()?.id!
    const planId = plan.id ?? uuidv4()

    // Insert Plan
    return from(
      this.supabase.from('workout_plans').insert({
        user_id: userId,
        name: plan.name,
      })
      .select()
      .single()
    ).pipe(
      // Danach die Days speichern
      switchMap(({ data: insertedPlan }) => {
        const dayRows = plan.days.map((day) => ({
          name: day.name,
          day: day.day,
          workout_plan_id: insertedPlan?.id
        }))
        return from(this.supabase.from('workout_days').insert(dayRows).select()).pipe(
          map((res) => res.data)
        )
      }),
      // Danach die Exercises speichern
      switchMap((workoutDays) => {
        console.log('workoutDay', workoutDays);
        const exerciseRows = plan.days.flatMap((day, i) =>
          day.exercises.map((ex) => ({
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            rest_time: ex.restTime ?? null,
            workout_day_id: workoutDays ? workoutDays[i]?.id : undefined
          })),
        )
        return from(this.supabase.from('exercises').insert(exerciseRows))
      }),
      map(() => planId), // Rückgabe: ID des Plans
    )
  }

  getWorkoutPlans(): Observable<any[]> {
      const promise = this.supabase.from('workout_plans')
  .select(`
    *,
    days: workout_days (
      *,
      exercises: exercises (*)
    )
  `)
      return from(promise).pipe(map((response) => {
          return response?.data ?? []
      }))
  }

  getWorkoutPlanById(planId: string): Observable<any> {
  const promise = this.supabase
    .from('workout_plans')
    .select(`
      *,
      days: workout_days (
        *,
        exercises: exercises (*)
      )
    `)
    .eq('id', planId) // WHERE id = planId
    .single()         // nur 1 Ergebnis

  return from(promise).pipe(
    map((res) => res.data)
  )
}

}
