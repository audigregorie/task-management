import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Status } from '../../types/status.enum'
import { TaskService } from '../../services/task.service'
import { Subject, map, takeUntil } from 'rxjs'
import { Task } from '../../types/task.type'
import { TaskSharedService } from '../../services/task-shared.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService)
  private taskSharedService = inject(TaskSharedService)

  private destroy$ = new Subject<void>()
  public tasks: Task[] = []

  constructor() { }

  ngOnInit(): void {
    this.fetchTasks()
  }

  // Fetch tasks from the service pulling from the server.
  public fetchTasks() {
    this.taskService.tasks$.pipe(takeUntil(this.destroy$), map((tasks) => (this.tasks = tasks))).subscribe()
  }

  // Ensure the subscription is destroyed.
  ngOnDestroy(): void {
    this.destroy$.complete()
  }

  // Filter tasks by status.
  public getFilteredTasks(selectedStatus?: Status): Task[] {
    return this.tasks.filter((task) => task.status === selectedStatus)
  }

  // Get the length of the filtered tasks.
  public getFilteredTaskCount(selectedStatus?: Status): number {
    return this.getFilteredTasks(selectedStatus).length
  }

  // Update the status and filtered task count.
  public updateSelectedStatusAndCount(selectedStatus?: Status) {
    this.taskSharedService.setSelectStatus(selectedStatus)
    this.taskSharedService.setFilterStatusCount(this.getFilteredTaskCount(selectedStatus))
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

  public showCompletedTasks() {
    this.updateSelectedStatusAndCount(Status.complete)
  }
}
