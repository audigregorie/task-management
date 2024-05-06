import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Task } from '../types/task.type'
import { environment } from '../../../environments/environment.development'
import { BehaviorSubject, Observable, catchError, forkJoin, of, tap } from 'rxjs'
import { Status } from '../types/status.enum'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient)

  private tasks$: Observable<Task[]> | null = null

  private tasks: Task[] = []

  // Searched Tasks Subject.
  private searchedTasksSubject = new BehaviorSubject<Task[]>([])
  public searchedTasks$: Observable<Task[]> = this.searchedTasksSubject.asObservable()
  public setSearchedTasks(tasks: Task[]) {
    this.searchedTasksSubject.next(tasks)
  }

  // Selected Status Subject.
  private selectedStatusSubject = new BehaviorSubject<Status | undefined>(undefined)
  public selectedStatus$: Observable<Status | undefined> = this.selectedStatusSubject.asObservable()
  public setSelectedStatus(status: Status | undefined) {
    this.selectedStatusSubject.next(status)
  }

  // Filtered Status Count.
  // private filteredStatusCountSubject = new BehaviorSubject<number>(0)
  private filteredStatusCountSubject = new BehaviorSubject<number>(this.tasks.length)
  public filteredStatusCount$: Observable<any> = this.filteredStatusCountSubject.asObservable()
  public setFilteredStatusCount(count: number) {
    this.filteredStatusCountSubject.next(count)
  }

  // Log Error.
  private logError(error: Error, errorValue: any) {
    console.error(error)
    return of(errorValue)
  }

  constructor() { }

  // Get Tasks.
  public getTasks(): Observable<Task[]> {
    this.tasks$ = this.http.get<Task[]>(environment.baseUrl).pipe(
      tap((tasks) => {
        this.tasks = tasks
      }),
      catchError((error) => this.logError(error, [])),
    )
    return this.tasks$
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

  // Delete all tasks.
  public deleteAllTasks(): Observable<Task[]> {
    return forkJoin(
      this.tasks.map((task) => {
        return this.deleteTask(task.id)
      }),
    )
  }

  // Update Task.
  public updateTask(task: Task, taskId: string): Observable<Task> {
    return this.http.put<Task>(`${environment.baseUrl}/${taskId}`, task)
  }
}
