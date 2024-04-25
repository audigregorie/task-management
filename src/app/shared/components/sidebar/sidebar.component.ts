import { Component } from '@angular/core'
import { Status } from '../../types/status.enum'
import { TaskService } from '../../services/task.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public selectedStatus: Status | undefined

  constructor(private taskService: TaskService) {}

  // Show All Tasks
  public showAllTasks() {
    this.selectedStatus = undefined
    this.taskService.setSelectedStatus(undefined)
  }

  // Show Open Tasks
  public showOpenTasks() {
    this.selectedStatus = Status.open
    this.taskService.setSelectedStatus(Status.open)
  }

  // Show In Progress Tasks
  public showProgressTasks() {
    this.selectedStatus = Status.progress
    this.taskService.setSelectedStatus(Status.progress)
  }

  // Show Completed Tasks
  public showCompletedTasks() {
    this.selectedStatus = Status.complete
    this.taskService.setSelectedStatus(Status.complete)
  }
}
