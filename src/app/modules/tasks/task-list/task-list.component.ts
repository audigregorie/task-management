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
  public date: Date = new Date()
  public openDropdownId: string | null = null
  public tasks: Task[] = []
  public tasks$!: Observable<Task[]>
  // public totalTaskCount: number | null = null
  public totalTaskCount: number | null = null

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.subscribeNewTaskSubject()
    this.loadTasks()
  }

  // Question !
  // public loadTasks() {
  // this.tasks$ = this.taskService.getTasks()
  // this.tasks$.pipe(
  //   map((tasks: Task[]) => {
  //     this.tasks = tasks
  //   }),
  // )
  // }

  // Question !
  // public subscribeNewTaskSubject() {
  //   this.taskService.newTaskSubject.pipe(
  //     tap((task: Task) => {
  //       this.taskService.addTask(task).pipe(
  //         tap(() => {
  //           this.loadTasks()
  //         }),
  //       )
  //     }),
  //   )
  // }

  // Get all tasks from database and assign the variable array to the observable array.
  public loadTasks() {
    this.tasks$ = this.taskService.getTasks()
    this.tasks$.subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks
        this.totalTaskCount = this.tasks.length
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

  // Toggle dropdown by id
  public toggleDropdownById(taskId: string) {
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
  public deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.openDropdownId = taskId
        this.loadTasks()
      },
    })
  }
}
