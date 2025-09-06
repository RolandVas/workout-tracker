import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { WorkoutPlanComponent } from './components/workout-plan.component';
import { LogWorkoutComponent } from './components/log-workout.component';
import { WorkoutHistoryComponent } from './components/workout-history.component';
import { ProgressComponent } from './components/progress.component';
import { ProfileComponent } from './components/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'plan', component: WorkoutPlanComponent },
  { path: 'log', component: LogWorkoutComponent },
  { path: 'history', component: WorkoutHistoryComponent },
  { path: 'progress', component: ProgressComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '/dashboard' }
];