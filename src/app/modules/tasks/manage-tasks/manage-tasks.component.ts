import { Component } from '@angular/core'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrl: './manage-tasks.component.scss',
})
export class ManageTasksComponent {
  constructor(private taskService: TaskService) {}

  clearTasks() {}
}
