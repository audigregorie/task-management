import { Component, OnInit, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private taskService = inject(TaskService)

  public tasks$!: Observable<Task[]>

  constructor() { }

  ngOnInit(): void {
    this.tasks$ = this.taskService.fetchTasks()
  }

  // Update task stream
  public updateTasks() {
    this.tasks$ = this.taskService.fetchTasks()
  }
}
