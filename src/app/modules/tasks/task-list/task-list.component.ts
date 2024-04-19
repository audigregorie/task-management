import { Component, OnInit } from '@angular/core'
import { TaskService } from '../../../shared/services/task.service'
import { Task } from '../../../shared/types/task.type'
import { Observable, map, tap } from 'rxjs'

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  public tasks$!: Observable<Task[]>
  public tasks: Task[] = []
  public date: Date = new Date()

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks()
    this.subscribeNewTaskSubject()
  }

  // Get all tasks from database and assign the variable array to the observable array.
  public loadTasks() {
    this.tasks$ = this.taskService.getTasks()
    this.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks
    })
  }

  // Subscribe to the subject and pass the response to the add task service.
  public subscribeNewTaskSubject() {
    this.taskService.newTaskSubject.subscribe((newTask: Task) => {
      this.taskService.addTask(newTask).subscribe(() => {
        this.loadTasks()
      })
    })
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
  //       this.taskService.addTask(data).pipe(
  //         tap(() => {
  //           this.loadTasks()
  //         }),
  //       )
  //     }),
  //   )
  // }
}
