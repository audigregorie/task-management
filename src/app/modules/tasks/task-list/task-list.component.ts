import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Status } from '../../../shared/types/status.enum'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  @Input() public tasks: Task[] = []
  @Output() public update: EventEmitter<void> = new EventEmitter()
  public currentDate: string = new Date().toISOString().split('T')[0]
  public openDropdownId: string | null = null
  public rawTasks: Task[] = []
  public selectedStatus: Status | undefined
  public taskStatuses = Status
  public totalTaskCount: number = 0

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.stringifyAndParseForRawTasks()

    // this.updateTaskCount()

    this.updateSelectedStatus()

    this.updateFilteredStatusCount()

    this.updateSearchedTasks()
  }

  // Create an unmodified raw Tasks array.
  public stringifyAndParseForRawTasks() {
    this.rawTasks = JSON.parse(JSON.stringify(this.tasks))
  }

  // Update counter of total tasks
  // public updateTaskCount() {
  //   this.totalTaskCount = this.tasks.length
  // }

  // Update through the selected status.
  public updateSelectedStatus() {
    this.taskService.selectedStatus$.subscribe((status) => {
      this.selectedStatus = status
    })
  }

  // Update the count of tasks filtered by selected status.
  public updateFilteredStatusCount() {
    this.taskService.filteredStatusCount$.subscribe((count) => {
      this.totalTaskCount = count
    })
  }

  // Update by searched tasks.
  public updateSearchedTasks() {
    this.taskService.searchedTasks$.subscribe((tasks) => {
      this.tasks = tasks
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
        task.isEditing = false
        this.update.emit()
        this.closeDropdown()
        this.tasks
      },
    })
  }
}
