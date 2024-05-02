import { Component, EventEmitter, Output, inject } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Status } from '../../../shared/types/status.enum'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  private taskService = inject(TaskService)
  private datePipe = inject(DatePipe)

  @Output() public update: EventEmitter<void> = new EventEmitter()
  public taskForm: FormGroup
  public visible: boolean = false

  // Initialize the form.
  constructor() {
    this.taskForm = new FormGroup({
      description: new FormControl(''),
      dueDate: new FormControl('', [Validators.required]),
      status: new FormControl(Status.open, [Validators.required]),
      task: new FormControl('', [Validators.required]),
    })
  }

  // Show the dialog.
  public showDialog() {
    this.visible = true
  }

  // Create a new task and send it to the subject variable. Reset and hide the form.
  public onAddNewTask() {
    const newTask: Task = {
      ...this.taskForm.value,
      currentDate: new Date().toISOString(),
      dateCreated: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      dueDate: this.taskForm.get('dueDate')?.value,
      id: Math.floor(Math.random() * 1000000).toString(),
      isCompleted: false,
      isEditing: false,
    }

    this.taskService.addTask(newTask).subscribe({
      next: () => {
        this.update.emit()
      },
      complete: () => {
        this.taskForm.reset()
        this.visible = false
      },
    })
  }
}
