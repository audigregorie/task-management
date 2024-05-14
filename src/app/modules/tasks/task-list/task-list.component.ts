import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core'
import { Status } from '../../../shared/types/status.enum'
import { Subject, map, takeUntil, tap } from 'rxjs'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'
import { TaskSharedService } from '../../../shared/services/task-shared.service'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {

  private taskService = inject(TaskService)
  private taskSharedService = inject(TaskSharedService)

  @Input() public tasks: Task[] = []
  @Output() public update: EventEmitter<void> = new EventEmitter()
  private destroy$ = new Subject<void>()
  public currentDate: string = new Date().toISOString().split('T')[0]
  public openDropdownId: string | null = null
  public rawTasks: Task[] = []
  public selectStatus: Status | undefined
  public taskStatuses = Status
  public totalTaskCount: number = this.tasks.length

  constructor() { }

  ngOnInit(): void {
    this.fetchTasks()
    this.getTotalTaskCount()
    this.stringifyAndParseForRawTasks()
    this.updateSelectStatus()
    this.updateFilterStatusCount()
    this.updateSearchTasks()
  }

  // Ensure the subscription is destroyed.
  ngOnDestroy(): void {
    this.destroy$.complete()
  }

  // Fetch tasks from the service pulling from the server.
  public fetchTasks() {
    this.taskService.fetchTasks().pipe(takeUntil(this.destroy$), tap((tasks) => (this.tasks = tasks))).subscribe()
  }

  // Create an unmodified raw Tasks array.
  public stringifyAndParseForRawTasks() {
    this.rawTasks = JSON.parse(JSON.stringify(this.tasks))
  }

  // Update through the selected status.
  public updateSelectStatus() {
    this.taskSharedService.selectStatus$.pipe(takeUntil(this.destroy$), map((status) => this.selectStatus = status)).subscribe()
  }

  // Update the count of tasks filtered by selected status.
  public updateFilterStatusCount() {
    this.taskSharedService.filterStatusCount$.pipe(takeUntil(this.destroy$), map((count) => count ? (this.totalTaskCount = count) : this.getTotalTaskCount())).subscribe()
  }

  // Update by searched tasks.
  public updateSearchTasks() {
    this.taskSharedService.searchTasks$.pipe(takeUntil(this.destroy$), map((searchedTasks) => this.tasks = searchedTasks)).subscribe()
  }

  // Get number of tasks from the service pulling from the server.
  public getTotalTaskCount() {
    this.taskService.tasks$.pipe((takeUntil(this.destroy$)), map(tasks => { this.totalTaskCount = tasks.length })).subscribe()
  }

  // Toggle dropdown by id.
  public onToggleDropdownById(taskId: string) {
    this.openDropdownId = this.openDropdownId === taskId ? null : taskId
  }

  // Set the isEditing property to true.
  public onToggleEditing(task: Task) {
    task.isEditing = !task.isEditing
  }

  // Close dropdown after item selected.
  public onCloseDropdown() {
    this.openDropdownId = null
  }

  public onCloseDropdownAndEmit() {
    this.update.emit()
    this.onCloseDropdown()
  }

  // Cycle through task statuses if editing.
  public cycleStatus(task: Task) {
    const statusValues = Object.values(Status)
    const currentIndex = statusValues.indexOf(task.status)
    const nextIndex = (currentIndex + 1) % statusValues.length
    task.status = statusValues[nextIndex]
  }

  // Delete task.
  public onDelete(taskId: string) {
    this.taskService.deleteTask(taskId).pipe(takeUntil(this.destroy$), tap(() => this.onCloseDropdownAndEmit())).subscribe()
  }

  // Cancel editing.
  public onCancel(task: Task) {
    const originalTask = this.rawTasks.find((t) => t.id === task.id) as Task
    const index = this.tasks.findIndex((t) => t.id === task.id)

    this.tasks[index] = {
      ...this.tasks[index],
      description: originalTask.description,
      isEditing: false,
      task: originalTask.task,
    }

    this.onCloseDropdown()
  }

  // Update task after editing.
  public onUpdate(task: Task, taskId: string) {
    const editedTask = { ...task, isEditing: false }
    this.taskService.updateTask(editedTask, taskId).pipe(takeUntil(this.destroy$), tap(() => this.onCloseDropdownAndEmit())).subscribe()
  }

  // Mange dropdown option whether to update or edit.
  public onManageProceed(task: Task) {
    task.isEditing ? this.onUpdate(task, task.id) : this.onToggleEditing(task);
  }

  // Mange dropdown option whether to cancel or delete.
  public onManageRevert(task: Task) {
    task.isEditing ? this.onCancel(task) : this.onDelete(task.id)
  }
}
