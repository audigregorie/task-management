import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableModule } from 'primeng/table'

// Components
import { ManageTasksComponent } from '../modules/tasks/manage-tasks/manage-tasks.component'
import { TaskListComponent } from '../modules/tasks/task-list/task-list.component'
import { AddTaskComponent } from '../modules/tasks/add-task/add-task.component'

@NgModule({
  declarations: [ManageTasksComponent, TaskListComponent, AddTaskComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule],
  exports: [ManageTasksComponent, TaskListComponent, AddTaskComponent],
})
export class TasksModule {}
