import { Component, OnInit } from '@angular/core'
import { TaskService } from '../../../shared/services/task.service'
import { Task } from '../../../shared/types/task.type'

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrl: './manage-tasks.component.scss',
})
export class ManageTasksComponent implements OnInit {
  public taskList: Task[] = []
  // FIX: Null operator
  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.taskList = tasks
      },
    })
  }

  // FIX: Not Working
  onClearTasks() {
    this.taskService.deleteTasks().subscribe({
      next: () => {
        this.taskList = []
      },
    })
  }
}
