import { Component, input } from '@angular/core';
import { WorkoutDay } from '../../../../models/interface';

@Component({
  selector: 'app-workout-plan-presenter',
  standalone: true,
  imports: [],
  templateUrl: './workout-plan-presenter.component.html',
  styleUrl: './workout-plan-presenter.component.scss'
})
export class WorkoutPlanPresenterComponent {
  day = input.required<WorkoutDay>()

}
