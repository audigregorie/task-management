import { Component } from '@angular/core'
import { Status } from '../../types/status.enum'
import { TaskService } from '../../services/task.service'
import { Observable } from 'rxjs'
import { Task } from '../../types/task.type'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public selectedStatus: Status | undefined = undefined
  public tasks$: Observable<Task[]> = this.taskService.getTasks()
  public tasks: Task[] = []

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.tasks$.subscribe((tasks) => (this.tasks = tasks))
  }

  // Filter tasks by status.
  public getFilteredTasks(selectedStatus?: Status): Task[] {
    return selectedStatus ? this.tasks.filter((task) => task.status === selectedStatus) : this.tasks
  }

  // Get the length of the filtered tasks.
  public getFilteredTaskCount(selectedStatus?: Status): number {
    return this.getFilteredTasks(selectedStatus).length
  }

  // Update the status and filtered task count.
  public updateSelectedStatusAndCount(selectedStatus?: Status) {
    this.selectedStatus = selectedStatus
    this.taskService.setSelectedStatus(selectedStatus)
    this.taskService.setFilteredStatusCount(this.getFilteredTaskCount(selectedStatus))
  }

  // Show all tasks.
  public showAllTasks() {
    this.updateSelectedStatusAndCount(undefined)
  }

  // Show open tasks.
  public showOpenTasks() {
    this.updateSelectedStatusAndCount(Status.open)
  }

  // Show progress tasks.
  public showProgressTasks() {
    this.updateSelectedStatusAndCount(Status.progress)
  }

  // Show completed tasks.
  public showCompletedTasks() {
    this.updateSelectedStatusAndCount(Status.complete)
  }
}
