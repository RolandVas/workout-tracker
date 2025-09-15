import { Injectable } from "@angular/core";
import { createClient } from "@supabase/supabase-js";
import { format } from "path";
import { from, map, Observable, switchMap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { Database } from "../../types/database.types";
import { v4 as uuidv4 } from 'uuid';

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
    providedIn: 'root'
})
export class SupabaseService {
    supabase = createClient<Database>(
        environment.supabaseUrl,
        environment.supabaseKey,
    )

    saveWorkoutPlan(plan: WorkoutPlan) {
        return from(this.supabase.auth.getUser()).pipe(
            switchMap(({ data: { user }, error }) => {
                if (error || !user) throw new Error('Not logged in');
                const userId = user.id;
                const planId = plan.id ?? uuidv4();

                // Insert Plan
                return from(
                    this.supabase.from('workout_plans').insert({
                        id: planId,
                        user_id: userId,
                        name: plan.name
                    })
                ).pipe(
                    // Danach die Days speichern
                    switchMap(() => {
                        const dayRows = plan.days.map((day) => ({
                            id: day.id ?? uuidv4(),
                            workout_plan_id: planId,
                            name: day.name,
                            day: day.day,
                        }));
                        return from(this.supabase.from('workout_days').insert(dayRows));
                    }),
                    // Danach die Exercises speichern
                    switchMap(() => {
                        const exerciseRows = plan.days.flatMap((day) =>
                            day.exercises.map((ex) => ({
                                id: ex.id ?? uuidv4(),
                                workout_day_id: planId, // Achtung: hier ggf. day.id referenzieren
                                name: ex.name,
                                sets: ex.sets,
                                reps: ex.reps,
                                weight: ex.weight,
                                rest_time: ex.restTime ?? null,
                            }))
                        );
                        return from(this.supabase.from('exercises').insert(exerciseRows));
                    }),
                    map(() => planId) // Rückgabe: ID des Plans
                );
            })
        );
    }

    // getWorkoutDays(): Observable<any[]> {
    //     const promise = this.supabase.from('workout_days').select('*')
    //     return from(promise).pipe(map((response) => {
    //         return response?.data ?? []
    //     }))
    // }
}
