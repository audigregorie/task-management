import { Component, OnInit, inject } from '@angular/core'
import { Status } from '../../types/status.enum'
import { TaskService } from '../../services/task.service'
import { Observable, Subject, takeUntil } from 'rxjs'
import { Task } from '../../types/task.type'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private taskService = inject(TaskService)

  private destroy$ = new Subject<void>()
  public tasks$: Observable<Task[]> = this.taskService.getTasks()

  public selectedStatus: Status | undefined = undefined
  public tasks: Task[] = []

  constructor() { }

  // Subscribe to tasks and set tasks.
  ngOnInit(): void {
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => (this.tasks = tasks))
  }

  // Ensure the subscription is destroyed.
  ngOnDestroy(): void {
    this.destroy$.next()
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

  public showCompletedTasks() {
    this.updateSelectedStatusAndCount(Status.complete)
  }
}
