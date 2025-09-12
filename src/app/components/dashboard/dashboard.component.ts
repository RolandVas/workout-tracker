import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { AuthService } from '../../services/auth.service';
import { WorkoutLog, WorkoutPlan } from '../../models/interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private authService: AuthService = inject(AuthService)

  currentUser = this.authService.currentUserValue;
  currentPlan: WorkoutPlan | null = null;
  recentLogs: WorkoutLog[] = [];
  todaysWorkout: any = null;
  today = new Date();

  constructor(
    public router: Router,
    private workoutService: WorkoutService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.workoutService.getWorkoutLogs().subscribe(logs => {
      this.recentLogs = logs.filter(log =>
        new Date(log.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    });

    this.currentPlan = this.workoutService.getCurrentPlan();

    // Get today's workout based on day of week
    if (this.currentPlan) {
      const todayName = this.today.toLocaleDateString('en-US', { weekday: 'long' });
      this.todaysWorkout = this.currentPlan.days.find(day => day.day === todayName);
    }
  }

  getTotalExercises(): number {
    if (!this.currentPlan) return 0;
    return this.currentPlan.days.reduce((total, day) => total + day.exercises.length, 0);
  }

  startWorkout(): void {
    this.router.navigate(['/log'], {
      queryParams: { day: this.todaysWorkout?.id }
    });
  }
}
