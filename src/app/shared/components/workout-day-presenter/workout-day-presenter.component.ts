import { Component, input, signal } from '@angular/core';
import { WorkoutDay } from '../../../models/interface';

@Component({
  selector: 'app-workout-day-presenter',
  standalone: true,
  imports: [],
  templateUrl: './workout-day-presenter.component.html',
  styleUrl: './workout-day-presenter.component.scss'
})
export class WorkoutDayPresenterComponent {
  workoutDay = input.required<WorkoutDay>()
}
