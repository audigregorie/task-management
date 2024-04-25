import { Component, EventEmitter, Output } from '@angular/core'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrl: './manage-tasks.component.scss',
})
export class ManageTasksComponent {
  @Output() public update: EventEmitter<void> = new EventEmitter()
  constructor(private taskService: TaskService) {}

  public updateTasks() {
    this.update.emit()
  }

  // FIX: Not Working
  onClearTasks() {
    this.taskService.deleteAllTasks().subscribe({
      next: () => {
        this.update.emit()
      },
    })
  }
}
