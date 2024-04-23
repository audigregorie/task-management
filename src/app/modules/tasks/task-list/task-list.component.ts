import { Component, OnInit } from '@angular/core'
import { TaskService } from '../../../shared/services/task.service'
import { Task } from '../../../shared/types/task.type'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  public currentDate: string = new Date().toISOString().split('T')[0]
  public openDropdownId: string | null = null
  // FIX: Null operator
  public task!: Task
  public taskList: Task[] = []
  // FIX: Null operator
  public tasks$!: Observable<Task[]>
  public totalTaskCount: number | null = null

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.subscribeNewTaskSubject()
    this.loadTasks()
  }

  // Get all tasks from database and assign the variable array to the observable array.
  public loadTasks() {
    this.tasks$ = this.taskService.getTasks()
    this.tasks$.subscribe({
      next: (tasks: Task[]) => {
        this.taskList = tasks
        this.totalTaskCount = this.taskList.length
      },
    })
  }

  // Subscribe to the subject and pass the response to the add task service.
  public subscribeNewTaskSubject() {
    this.taskService.newTaskSubject.subscribe({
      next: (newTask: Task) => {
        this.taskService.addTask(newTask).subscribe({
          next: () => {
            this.loadTasks()
          },
        })
      },
    })
  }

  // Cycle through task statuses if editing
  public cycleStatus(task: Task) {
    const statuses = ['open', 'progress', 'complete']
    const currentIndex = statuses.indexOf(task.status)
    const nextIndex = (currentIndex + 1) % statuses.length
    task.status = statuses[nextIndex]
  }

  // Toggle dropdown by id
  public onToggleDropdownById(taskId: string) {
    if (this.openDropdownId === taskId) {
      this.openDropdownId = null
    } else {
      this.openDropdownId = taskId
    }
  }

  // Close dropdown after item selected
  public closeDropdown() {
    this.openDropdownId = null
  }

  // Delete task.
  public onDeleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.openDropdownId = taskId
        this.loadTasks()
      },
    })
  }

  // Set the isEditing property to true
  public onEditTask(task: Task) {
    task.isEditing = true
  }

  // A quicker way to edit a task
  public onQuickEditTask(task: Task) {
    task.isEditing = true
  }

  public onUpdateTask() {}

  // Cancel all edits
  public onCancelEditing(task: Task) {
    task.isEditing = false
    this.closeDropdown()
    console.log('Escaped key pressed')
  }
}
