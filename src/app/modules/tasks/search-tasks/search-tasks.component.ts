import { Component, Input, OnInit, inject } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { debounceTime, distinctUntilChanged, tap } from 'rxjs'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrl: './search-tasks.component.scss',
})
export class SearchTasksComponent implements OnInit {
  private taskService = inject(TaskService)

  @Input() public tasks: Task[] = []
  public form: FormGroup

  constructor() {
    this.form = new FormGroup({
      search: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.taskService.setSearchedTasks(tasks)
    })

    this.form
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchTerm) => {
          if (searchTerm) {
            const filteredTasks = this.tasks.filter((task) => task.task.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase()))
            this.taskService.setSearchedTasks(filteredTasks)
          } else {
            this.taskService.setSearchedTasks(this.tasks)
          }
        }),
      )
      .subscribe()
  }
}
