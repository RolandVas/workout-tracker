import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutLog } from '../../models/interface';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workout-history.component.html',
  styleUrls: ['./workout-history.component.scss']
})
export class WorkoutHistoryComponent implements OnInit {
  workoutLogs: WorkoutLog[] = [];
  filteredLogs: WorkoutLog[] = [];
  selectedFilter = 'all';
  expandedWorkouts = new Set<string>();

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.loadWorkoutHistory();
  }

  private loadWorkoutHistory(): void {
    this.workoutService.getWorkoutLogs().subscribe(logs => {
      this.workoutLogs = logs;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const now = new Date();
    const filterDate = new Date();

    switch (this.selectedFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      default:
        filterDate.setFullYear(2020); // Show all
    }

    this.filteredLogs = this.workoutLogs.filter(log => 
      new Date(log.date) >= filterDate
    );
  }

  toggleExpanded(workoutId: string): void {
    if (this.expandedWorkouts.has(workoutId)) {
      this.expandedWorkouts.delete(workoutId);
    } else {
      this.expandedWorkouts.add(workoutId);
    }
  }

  getTotalDuration(): number {
    const totalMinutes = this.filteredLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return Math.round(totalMinutes / 60 * 10) / 10; // Convert to hours, 1 decimal
  }

  getUniqueExercises(): number {
    const exerciseNames = new Set();
    this.filteredLogs.forEach(log => {
      log.exercises.forEach(exercise => {
        exerciseNames.add(exercise.name);
      });
    });
    return exerciseNames.size;
  }

  getAverageWorkout(): number {
    if (this.filteredLogs.length === 0) return 0;
    const totalDuration = this.filteredLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    return Math.round(totalDuration / this.filteredLogs.length);
  }

  getCalendarDays(): any[] {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const days = [];
    const workoutDates = new Map();
    
    // Map workout dates
    this.workoutLogs.forEach(log => {
      const dateKey = new Date(log.date).toDateString();
      workoutDates.set(dateKey, log.dayName);
    });

    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
      const dateKey = currentDate.toDateString();
      
      days.push({
        date: currentDate,
        hasWorkout: workoutDates.has(dateKey),
        workoutName: workoutDates.get(dateKey) || ''
      });
    }

    return days;
  }

  navigateToLog(): void {
    // In a real app, this would use Router
    window.location.hash = '/log';
  }
}