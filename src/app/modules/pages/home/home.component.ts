import { Component } from '@angular/core'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public tasks$: Observable<Task[]> | null = this.taskService.getTasks()

  constructor(private taskService: TaskService) {}

  public updateTasks() {
    this.tasks$ = this.taskService.getTasks()
  }
}
