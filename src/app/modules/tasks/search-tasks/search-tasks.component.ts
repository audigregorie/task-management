import { Component, Input, OnInit } from '@angular/core'
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
  @Input() public tasks: Task[] = []
  public searchForm: FormGroup

  constructor(private taskService: TaskService) {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.taskService.setSearchedTasks(tasks)
    })

    this.searchForm
      .get('searchTerm')
      ?.valueChanges.pipe(
        debounceTime(300),
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
