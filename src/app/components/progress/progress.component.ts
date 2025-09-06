import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { ProgressData } from '../../models/interface';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  availableExercises: string[] = [];
  selectedExercise = '';
  progressData: ProgressData | null = null;
  activeChart = 'weight';

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadAvailableExercises();
  }

  private loadAvailableExercises(): void {
    // Get unique exercises from current plan
    const currentPlan = this.workoutService.getCurrentPlan();
    if (currentPlan) {
      const exercises = new Set<string>();
      currentPlan.days.forEach(day => {
        day.exercises.forEach(exercise => {
          exercises.add(exercise.name);
        });
      });
      this.availableExercises = Array.from(exercises).sort();
    }
  }

  selectExercise(exercise: string): void {
    this.selectedExercise = exercise;
    this.loadProgressData();
  }

  loadProgressData(): void {
    if (!this.selectedExercise) return;

    this.workoutService.getProgressData(this.selectedExercise).subscribe(data => {
      this.progressData = data;
    });
  }

  getMaxWeight(): number {
    if (!this.progressData?.data.length) return 0;
    return Math.max(...this.progressData.data.map(d => d.weight));
  }

  getMaxReps(): number {
    if (!this.progressData?.data.length) return 0;
    return Math.max(...this.progressData.data.map(d => d.reps));
  }

  getImprovement(): number {
    if (!this.progressData?.data.length || this.progressData.data.length < 2) return 0;
    const first = this.progressData.data[0];
    const last = this.progressData.data[this.progressData.data.length - 1];
    const firstValue = this.activeChart === 'weight' ? first.weight : first.reps;
    const lastValue = this.activeChart === 'weight' ? last.weight : last.reps;
    return Math.round(((lastValue - firstValue) / firstValue) * 100);
  }

  getTotalSessions(): number {
    return this.progressData?.data.length || 0;
  }

  getYAxisTicks(): number[] {
    if (!this.progressData?.data.length) return [];
    const values = this.progressData.data.map(d => 
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const step = Math.ceil(range / 5);
    
    const ticks = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push(Math.round(max - (i * step)));
    }
    return ticks;
  }

  getChartPoints(): string {
    if (!this.progressData?.data.length) return '';
    
    const values = this.progressData.data.map(d => 
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    const points = this.progressData.data.map((d, i) => {
      const x = (i / (this.progressData!.data.length - 1 || 1)) * 380 + 10;
      const value = this.activeChart === 'weight' ? d.weight : d.reps;
      const y = 190 - ((value - min) / range) * 180;
      return `${x},${y}`;
    });
    
    return points.join(' ');
  }

  getDataPoints(): { x: number, y: number }[] {
    if (!this.progressData?.data.length) return [];
    
    const values = this.progressData.data.map(d => 
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    
    return this.progressData.data.map((d, i) => {
      const x = (i / (this.progressData!.data.length - 1 || 1)) * 380 + 10;
      const value = this.activeChart === 'weight' ? d.weight : d.reps;
      const y = 190 - ((value - min) / range) * 180;
      return { x, y };
    });
  }

  getXAxisDates(): Date[] {
    if (!this.progressData?.data.length) return [];
    const data = this.progressData.data;
    if (data.length <= 4) return data.map(d => d.date);
    
    // Show max 4 dates evenly distributed
    const indices = [0, Math.floor(data.length / 3), Math.floor(2 * data.length / 3), data.length - 1];
    return indices.map(i => data[i].date);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric' 
    });
  }

  getDisplayValue(session: any): number {
    return this.activeChart === 'weight' ? session.weight : session.reps;
  }

  calculateOneRM(weight: number, reps: number): number {
    // Epley formula: 1RM = weight * (1 + reps/30)
    return Math.round(weight * (1 + reps / 30));
  }
}