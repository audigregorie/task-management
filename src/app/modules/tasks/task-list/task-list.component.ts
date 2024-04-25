import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TaskService } from '../../../shared/services/task.service'
import { Task } from '../../../shared/types/task.type'
import { Status } from '../../../shared/types/status.enum'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  public rawTasks: Task[] = []
  @Input() public tasks: Task[] = []
  @Output() public update: EventEmitter<void> = new EventEmitter()

  public currentDate: string = new Date().toISOString().split('T')[0]
  public openDropdownId: string | null = null
  public taskStatuses = Status
  public totalTaskCount!: number

  public selectedStatus: Status | undefined

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.updateTaskCount()
    this.rawTasks = JSON.parse(JSON.stringify(this.tasks))

    this.taskService.selectedStatus$.subscribe((status) => {
      this.selectedStatus = status
    })
  }

  // Update counter of total tasks
  public updateTaskCount() {
    this.totalTaskCount = this.tasks.length
  }

  // Cycle through task statuses if editing
  public cycleStatus(task: Task) {
    const currentIndex = Object.values(Status).indexOf(task.status)
    const statusValues = Object.values(Status)
    const nextIndex = (currentIndex + 1) % statusValues.length
    task.status = statusValues[nextIndex]
  }

  // Toggle dropdown by id
  public onToggleDropdownById(taskId: string) {
    this.openDropdownId = this.openDropdownId === taskId ? null : taskId
  }

  // Close dropdown after item selected
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

  // Set the isEditing property to true
  public onEnableEditing(task: Task) {
    task.isEditing = true
  }

  // Cancel editing
  public onCancel(task: Task) {
    const originalTask = this.rawTasks.find((t) => t.id === task.id) as Task
    const index = this.tasks.findIndex((t) => t.id === task.id)

    this.tasks[index] = {
      ...this.tasks[index],
      description: originalTask.description,
      task: originalTask.task,
      isEditing: false,
    }

    task.isEditing = false
    this.closeDropdown()
  }

  // FIX: Update task after editing
  public onUpdate(task: Task, taskId: string) {
    const editedTask = {
      ...task,
      task: task.task,
      description: task.description,
      isEditing: false,
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
