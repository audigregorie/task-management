import { Component, EventEmitter, Output } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Status } from '../../../shared/types/status.enum'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  @Output() public update: EventEmitter<void> = new EventEmitter()
  public taskForm: FormGroup
  public visible: boolean = false

  // Initialize the form.
  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private datePipe: DatePipe,
  ) {
    this.taskForm = this.formBuilder.group({
      description: [''],
      dueDate: [''],
      status: [Status.open, [Validators.required]],
      task: ['', [Validators.required]],
    })
  }

  // Show the dialog.
  public showDialog() {
    this.visible = true
  }

  // Create a new task and send it to the subject variable. Reset and hide the form.
  public updateNewTaskSubject() {
    const currentDate = new Date().toISOString()
    const dateCreated = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    const dueDate = this.taskForm.get('dueDate')?.value
    const randomIdNumber = Math.floor(Math.random() * 1000000).toString()

    const newTask: Task = {
      ...this.taskForm.value,
      currentDate: currentDate,
      dateCreated: dateCreated,
      dueDate: dueDate,
      id: randomIdNumber,
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
