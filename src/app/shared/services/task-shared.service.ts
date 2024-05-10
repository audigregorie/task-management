import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Task } from '../types/task.type'
import { Status } from '../types/status.enum'

@Injectable({
  providedIn: 'root',
})
export class TaskSharedService {
  // Searched Tasks Subject.
  private searchTasksSub = new BehaviorSubject<Task[]>([])
  public searchTasks$: Observable<Task[]> = this.searchTasksSub.asObservable()
  public setSearchTasks(tasks: Task[]) {
    this.searchTasksSub.next(tasks)
  }

  // Selected Status Subject.
  private selectStatusSub = new BehaviorSubject<Status | undefined>(undefined)
  public selectStatus$: Observable<Status | undefined> = this.selectStatusSub.asObservable()
  public setSelectStatus(status: Status | undefined) {
    this.selectStatusSub.next(status)
  }

  // Filtered Status Count.
  private filterStatusCountSub = new BehaviorSubject<number>(0)
  public filterStatusCount$: Observable<any> = this.filterStatusCountSub.asObservable()
  public setFilterStatusCount(count: number) {
    this.filterStatusCountSub.next(count)
  }

  constructor() { }
}
