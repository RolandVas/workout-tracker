import { inject, Injectable, OnInit, signal } from '@angular/core';
import { AuthResponse } from '@supabase/supabase-js';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { User } from '../models/interface';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userService: UserService = inject(UserService)

  private supabaseService = inject(SupabaseService)

  login(email: string, password: string): Observable<AuthResponse> {
    const promis = this.supabaseService.supabase.auth.signInWithPassword({
      email,
      password
    })
    return from(promis)
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    const promis = this.supabaseService.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })
    return from(promis)
  }

  logout(): void {
    this.supabaseService.supabase.auth.signOut()
  }

  get isLoggedIn(): boolean {
    return !!this.userService.currentUser();
  }
}
