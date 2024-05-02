import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrl: './manage-tasks.component.scss',
})
export class ManageTasksComponent {
  private taskService = inject(TaskService)

  @Input() public tasks: Task[] = []
  @Output() public update: EventEmitter<void> = new EventEmitter()

  constructor() { }

  // Update tasks stream
  public updateTasks() {
    this.update.emit()
  }

  // Clear all tasks
  public onClearTasks() {
    this.taskService.deleteAllTasks().subscribe({
      next: () => {
        this.update.emit()
      },
    })
  }
}
