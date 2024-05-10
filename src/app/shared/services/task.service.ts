import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Task } from '../types/task.type'
import { environment } from '../../../environments/environment.development'
import { BehaviorSubject, Observable, catchError, forkJoin, map, of, shareReplay, switchMap, throwError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient)

  private readonly taskSub = new BehaviorSubject<Task[]>([])
  public tasks$: Observable<Task[]> = this.taskSub.asObservable().pipe(shareReplay(1))

  constructor() { }

  // Fetch tasks.
  public fetchTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(environment.baseUrl).pipe(map((tasks) => {
      this.taskSub.next(tasks)
      return tasks
    }),

      catchError((error) => {
        console.error('Error fetching employees:', error)
        return of([])
      }),
    )
  }

  // Add Task.
  public addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(environment.baseUrl, task).pipe(map((newTask) => {
      this.taskSub.next([...this.taskSub.getValue(), newTask])
      return newTask
    }),

      catchError((error) => {
        let errorMessage = 'Failed to add task'
        console.error('Error adding task:', error)
        return throwError(() => new Error(errorMessage))
      }),
    )
  }

  // Delete task.
  public deleteTask(taskId: string): Observable<void> {
    const url = `${environment.baseUrl}/${taskId}`

    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        let errorMessage = 'Failed to delete employee'
        console.error('Error deleting employee:', error)
        return throwError(() => new Error(errorMessage))
      }),
    )
  }

  // Delete all tasks.
  public deleteAllTasks(): Observable<any> {
    return this.tasks$.pipe(switchMap((tasks) => {
      return forkJoin(tasks.map((task) => this.deleteTask(task.id))).pipe(
        catchError((error) => {
          let errorMessage = 'Failed to delete all tasks'
          console.error('Error deleting all tasks:', error)
          return throwError(() => new Error(errorMessage))
        }),
      )
    }),
    )
  }

  // Update Task.
  public updateTask(task: Task, taskId: string): Observable<Task> {
    const url = `${environment.baseUrl}/${taskId}`

    return this.http.put<Task>(url, task).pipe(
      catchError((error) => {
        let errorMessage = 'Failed to update task'
        console.error('Error updating task:', error)
        return throwError(() => new Error(errorMessage))
      }),
    )
  }
}
