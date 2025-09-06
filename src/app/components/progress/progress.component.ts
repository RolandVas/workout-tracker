import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { WorkoutService } from '../../services/workout.service';
import { ProgressData } from '../../models/interface';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  availableExercises: string[] = [];
  selectedExercise = '';
  progressData: ProgressData | null = null;
  activeChart = 'weight';

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

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

  setActiveChart(type: 'weight' | 'reps'): void {
    this.activeChart = type;
    this.updateChart();
  }

  loadProgressData(): void {
    if (!this.selectedExercise) return;

    this.workoutService.getProgressData(this.selectedExercise).subscribe(data => {
      this.progressData = data;
      this.updateChart();
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

  private updateChart(): void {
    if (!this.progressData) return;
    const labels = this.progressData.data.map(d => this.formatShortDate(d.date));
    const data = this.progressData.data.map(d =>
      this.activeChart === 'weight' ? d.weight : d.reps
    );
    this.lineChartData = {
      labels,
      datasets: [
        {
          data,
          label: this.activeChart === 'weight' ? 'Weight' : 'Reps',
          fill: false,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.4
        }
      ]
    };
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

  calculateOneRM(weight: number, reps: number): number {
    // Epley formula: 1RM = weight * (1 + reps/30)
    return Math.round(weight * (1 + reps / 30));
  }
}