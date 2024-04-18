import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { InputTextareaModule } from 'primeng/inputtextarea'

// Components
import { ManageTasksComponent } from '../modules/tasks/manage-tasks/manage-tasks.component'
import { TaskListComponent } from '../modules/tasks/task-list/task-list.component'
import { AddTaskComponent } from '../modules/tasks/add-task/add-task.component'

@NgModule({
  declarations: [ManageTasksComponent, TaskListComponent, AddTaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextareaModule,
  ],
  exports: [ManageTasksComponent, TaskListComponent, AddTaskComponent],
})
export class TasksModule { }
