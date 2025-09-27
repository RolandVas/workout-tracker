import { inject, Injectable } from '@angular/core'
import { createClient } from '@supabase/supabase-js'
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
        id: '',
        user_id: userId,
        name: plan.name,
      })
      .select()
    ).pipe(
      // Danach die Days speichern
      switchMap(() => {
        const dayRows = plan.days.map((day) => ({
          workout_plan_id: '',
          name: day.name,
          day: day.day,
        }))
        return from(this.supabase.from('workout_days').insert(dayRows))
      }),
      // Danach die Exercises speichern
      switchMap(() => {
        const exerciseRows = plan.days.flatMap((day) =>
          day.exercises.map((ex) => ({
            workout_day_id: '',
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            rest_time: ex.restTime ?? null,
          })),
        )
        return from(this.supabase.from('exercises').insert(exerciseRows))
      }),
      map(() => planId), // Rückgabe: ID des Plans
    )
  }

  // saveWorkoutPlan(plan: WorkoutPlan) {
  //   const userId = this.userService.currentUser()?.id!
  //
  //   return from(
  //     this.supabase
  //       .from('workout_plans')
  //       .insert({
  //         user_id: userId,
  //         name: plan.name,
  //         workout_days: {
  //           data: plan.days.map(day => ({
  //             name: day.name,
  //             day: day.day,
  //             exercises: {
  //               data: day.exercises.map(ex => ({
  //                 name: ex.name,
  //                 sets: ex.sets,
  //                 reps: ex.reps,
  //                 weight: ex.weight,
  //                 rest_time: ex.restTime ?? null,
  //               }))
  //             }
  //           }))
  //         }
  //       })
  //       .select(`
  //       id,
  //       name,
  //       workout_days (
  //         id,
  //         name,
  //         day,
  //         exercises ( id, name, sets, reps, weight, rest_time )
  //       )
  //     `)
  //   ).pipe(
  //     map(({ data, error }) => {
  //       if (error) throw error
  //       return data?.[0] // fertiger Plan inkl. Days & Exercises
  //     })
  //   )
  // }

  // getWorkoutDays(): Observable<any[]> {
  //     const promise = this.supabase.from('workout_days').select('*')
  //     return from(promise).pipe(map((response) => {
  //         return response?.data ?? []
  //     }))
  // }
}
