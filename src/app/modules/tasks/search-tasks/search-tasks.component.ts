import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { Subject, debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs'
import { Task } from '../../../shared/types/task.type'
import { TaskSharedService } from '../../../shared/services/task-shared.service'

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrl: './search-tasks.component.scss',
})
export class SearchTasksComponent implements OnInit, OnDestroy {
  private taskSharedService = inject(TaskSharedService)

  @Input() public tasks: Task[] = []
  private destroy$ = new Subject<void>()
  public form: FormGroup

  constructor() {
    this.form = new FormGroup({
      search: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.sendSearchedTasks()
  }

  ngOnDestroy(): void {
    this.destroy$.complete()
  }

  // Send searched tasks to shared service.
  public sendSearchedTasks() {
    this.form.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      tap((searchTerm) => this.taskSharedService.setSearchTasks(searchTerm ? this.filterTasksBySearchTerm(searchTerm) : this.tasks))).subscribe()
  }

  // Filter tasks from search.
  public filterTasksBySearchTerm(searchTerm: string) {
    return this.tasks.filter((task) => task.task.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  }
}
