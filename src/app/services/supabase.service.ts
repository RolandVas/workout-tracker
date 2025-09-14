import { Injectable } from "@angular/core";
import { createClient } from "@supabase/supabase-js";
import { format } from "path";
import { from, map, Observable } from "rxjs";
import { environment } from "../../environments/environment.development";
// import { environment } from "../../environments/environment.development";
import { Database } from "../../types/database.types";
import { WorkoutDay } from "../models/interface";

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    supabase = createClient<Database>(
        environment.supabaseUrl,
        environment.supabaseKey,
    )

    // getWorkoutDays(): Observable<any[]> {
    //     const promise = this.supabase.from('workout_days').select('*')
    //     return from(promise).pipe(map((response) => {
    //         return response?.data ?? []
    //     }))
    // }
}
