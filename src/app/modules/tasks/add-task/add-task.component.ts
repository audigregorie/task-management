import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TaskService } from '../../../shared/services/task.service'
import { Task } from '../../../shared/types/task.type'
import { DatePipe } from '@angular/common'
import { Status } from '../../../shared/types/status.enum'

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  public taskForm: FormGroup
  public visible: boolean = false
  @Output() public update: EventEmitter<void> = new EventEmitter()

  // Initialize the form.
  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private datePipe: DatePipe,
  ) {
    this.taskForm = this.formBuilder.group({
      task: ['', [Validators.required]],
      description: [''],
      status: [Status.open, [Validators.required]],
      dueDate: [''],
    })
  }

  // Show the dialog.
  public showDialog() {
    this.visible = true
  }

  // Create a new task and send it to the subject variable. Reset and hide the form.
  public updateNewTaskSubject() {
    const randomIdNumber = Math.floor(Math.random() * 1000000).toString()
    const dateCreated = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    const dueDate = this.taskForm.get('dueDate')?.value
    const currentDate = new Date().toISOString()

    const newTask: Task = {
      ...this.taskForm.value,
      isEditing: false,
      isCompleted: false,
      id: randomIdNumber,
      dateCreated: dateCreated,
      dueDate: dueDate,
      currentDate: currentDate,
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
