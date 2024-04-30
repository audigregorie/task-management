import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { NgModule } from '@angular/core'
import { TableModule } from 'primeng/table'

// Pipes
import { DatePipe } from '@angular/common'
import { FilterStatusPipe } from '../shared/pipes/filter-status.pipe'

// Components
import { AddTaskComponent } from '../modules/tasks/add-task/add-task.component'
import { ManageTasksComponent } from '../modules/tasks/manage-tasks/manage-tasks.component'
import { SearchTasksComponent } from '../modules/tasks/search-tasks/search-tasks.component'
import { TaskListComponent } from '../modules/tasks/task-list/task-list.component'

@NgModule({
  declarations: [ManageTasksComponent, TaskListComponent, AddTaskComponent, SearchTasksComponent, FilterStatusPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextareaModule],
  providers: [DatePipe, FilterStatusPipe],
  exports: [ManageTasksComponent, TaskListComponent, AddTaskComponent, SearchTasksComponent],
})
export class TasksModule {}
