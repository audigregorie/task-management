import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Task } from '../types/task.type'
import { environment } from '../../../environments/environment.development'
import { Observable, catchError, forkJoin, of, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public tasks: Task[] = []
  // private tasks: Task[] = []
  private tasks$: Observable<Task[]> | null = null

  constructor(private http: HttpClient) {}

  public deleteAllTasks() {
    return forkJoin(
      this.tasks.map((task) => {
        return this.deleteTask(task.id)
      }),
    )
  }

  public setTasks() {
    this.tasks$ = this.http.get<Task[]>(environment.baseUrl).pipe(
      tap((tasks) => {
        this.tasks = tasks
      }),
      catchError((error) => this.logError(error, [])),
    )
    return this.tasks$
  }

  // Log Error.
  private logError(error: Error, errorValue: any) {
    console.error(error)
    return of(errorValue)
  }

  // Get Tasks.
  public getTasks(): Observable<Task[]> {
    return this.setTasks()
  }

  // Get Task.
  public getTask(taskId: string): Observable<Task | null> {
    const url = `${environment.baseUrl}/${taskId}`
    return this.http.get<Task>(url)
  }

  // Add Task.
  public addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(environment.baseUrl, task)
  }

  // Delete Task.
  public deleteTask(taskId: string): Observable<Task> {
    const url = `${environment.baseUrl}/${taskId}`
    return this.http.delete<Task>(url)
  }

  // Update Task.
  public updateTask(task: Task, taskId: string): Observable<Task> {
    return this.http.put<Task>(`${environment.baseUrl}/${taskId}`, task)
  }
}
