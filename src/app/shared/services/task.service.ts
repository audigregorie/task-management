import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Task } from '../types/task.type'
import { environment } from '../../../environments/environment.development'
import { Observable, Subject, catchError, map, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public newTaskSubject = new Subject<Task>()

  constructor(private http: HttpClient) {}

  // Send function to sender component to receive the sending data.
  public getNewTaskSubject(newTask: Task) {
    this.newTaskSubject.next(newTask)
  }

  // Log Response.
  private log(response: any) {
    console.log(response)
  }

  // Log Error.
  private logError(error: Error, errorValue: any) {
    console.error(error)
    return of(errorValue)
  }

  // Get Tasks.
  public getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(environment.baseUrl).pipe(
      map((data) => data),
      catchError((error) => this.logError(error, [])),
    )
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

  // Delete All Tasks.
  public deleteTasks(): Observable<void> {
    return this.http.delete<void>(environment.baseUrl)
  }
}
