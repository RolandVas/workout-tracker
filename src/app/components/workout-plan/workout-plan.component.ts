import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPlan, WorkoutDay, Exercise } from '../../models/interface';
import { WorkoutPlanPresenterComponent } from "./components/workout-plan-presenter/workout-plan-presenter.component";
import { RouterOutlet, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-workout-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoutPlanPresenterComponent, RouterOutlet, MatButtonModule],
  templateUrl: './workout-plan.component.html',
  styleUrls: ['./workout-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPlanComponent implements OnInit {
  private readonly supabaseService = inject(SupabaseService);
  private readonly workoutService = inject(WorkoutService);
  private router: Router = inject(Router);

  protected readonly workoutPlans = signal<WorkoutPlan[]>([]);

  protected readonly showCreateForm = signal(false);
  protected readonly currentPlan = signal<WorkoutPlan | null>(null);

  constructor() {
    this.currentPlan.set(this.workoutService.getCurrentPlan());
  }
  ngOnInit(): void {
    
    if (this.router.url === '/plan/create') {
      this.showCreateForm.set(true);
    }

    this.supabaseService.getWorkoutPlans().subscribe(plans => {
      console.log('Fetched plans:', plans);
      this.workoutPlans.set(plans);
      // this.workoutService.setWorkoutPlans(plans);
    })
  }

  public navigateToCreate(): void {
    if (!this.showCreateForm()) {
    this.showCreateForm.set(true);
    this.router.navigate(['/plan/create']);
    } else {
      this.showCreateForm.set(false);
      this.router.navigate(['/plan']);
    }
  }


  protected toggleCreateForm(): void {
    this.showCreateForm.update(v => !v);
  }

  navigateToSelectedPlan(planId: string): void {
    console.log('Navigating to plan with ID:', planId);
      this.router.navigate(['/plan', planId]);
      this.showCreateForm.set(true);
    
  }
}