import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-manage-tasks',
  templateUrl: './manage-tasks.component.html',
  styleUrl: './manage-tasks.component.scss',
})
export class ManageTasksComponent {
  @Input() public tasks: Task[] = []
  @Output() public update: EventEmitter<void> = new EventEmitter()

  constructor(private taskService: TaskService) {}

  public updateTasks() {
    this.update.emit()
  }

  public onClearTasks() {
    this.taskService.deleteAllTasks().subscribe({
      next: () => {
        this.update.emit()
      },
    })
  }
}
