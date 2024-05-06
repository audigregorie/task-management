import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core'
import { Status } from '../../../shared/types/status.enum'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'
import { Subject, startWith, takeUntil } from 'rxjs'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService)

  @Input() public tasks: Task[] = []
  @Output() public update: EventEmitter<void> = new EventEmitter()

  private destroy$ = new Subject<void>()

  public currentDate: string = new Date().toISOString().split('T')[0]
  public openDropdownId: string | null = null
  public rawTasks: Task[] = []
  public selectedStatus: Status | undefined
  public taskStatuses = Status
  public totalTaskCount: number = this.tasks.length

  constructor() { }

  ngOnInit(): void {
    this.stringifyAndParseForRawTasks()

    this.updateSelectedStatus()

    this.updateFilteredStatusCount()

    this.updateSearchedTasks()
  }

  // Ensure the subscription is destroyed.
  ngOnDestroy(): void {
    this.destroy$.next()
  }

  // Create an unmodified raw Tasks array.
  public stringifyAndParseForRawTasks() {
    this.rawTasks = JSON.parse(JSON.stringify(this.tasks))
  }

  // Update through the selected status.
  public updateSelectedStatus() {
    this.taskService.selectedStatus$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.selectedStatus = status
    })
  }

  // Update the count of tasks filtered by selected status.
  public updateFilteredStatusCount() {
    this.taskService.filteredStatusCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      count ? (this.totalTaskCount = count) : (this.totalTaskCount = this.tasks.length)
    })
  }

  // Update by searched tasks.
  public updateSearchedTasks() {
    this.taskService.searchedTasks$.pipe(takeUntil(this.destroy$)).subscribe((searchedTasks) => {
      this.tasks = searchedTasks
    })
  }

  // Cycle through task statuses if editing.
  public cycleStatus(task: Task) {
    const currentIndex = Object.values(Status).indexOf(task.status)
    const statusValues = Object.values(Status)
    const nextIndex = (currentIndex + 1) % statusValues.length
    task.status = statusValues[nextIndex]
  }

  // Toggle dropdown by id.
  public onToggleDropdownById(taskId: string) {
    this.openDropdownId = this.openDropdownId === taskId ? null : taskId
  }

  // Close dropdown after item selected.
  public closeDropdown() {
    this.openDropdownId = null
  }

  // Delete task.
  public onDelete(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.closeDropdown()
        this.tasks
        this.update.emit()
      },
    })
  }

  // Set the isEditing property to true.
  public onEnableEditing(task: Task) {
    task.isEditing = true
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

    task.isEditing = false
    this.closeDropdown()
  }

  // FIX: Update task after editing.
  public onUpdate(task: Task, taskId: string) {
    const editedTask = {
      ...task,
      description: task.description,
      isEditing: false,
      task: task.task,
    }

    this.taskService.updateTask(editedTask, taskId).subscribe({
      next: () => {
        this.update.emit()
      },
      complete: () => {
        task.isEditing = false
        this.closeDropdown()
        this.tasks
      },
    })
  }
}
