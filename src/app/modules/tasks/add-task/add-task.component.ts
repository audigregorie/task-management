import { Component, EventEmitter, OnDestroy, Output, inject } from '@angular/core'
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Status } from '../../../shared/types/status.enum'
import { Task } from '../../../shared/types/task.type'
import { TaskService } from '../../../shared/services/task.service'
import { Subject, takeUntil, tap } from 'rxjs'

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnDestroy {
  private taskService = inject(TaskService)
  private datePipe = inject(DatePipe)

  @Output() public update: EventEmitter<void> = new EventEmitter()
  private destroy$ = new Subject<void>()
  public form: FormGroup
  public isVisible: boolean = false

  // Form initialization.
  constructor() {
    this.form = new FormGroup({
      description: new FormControl(''),
      dueDate: new FormControl('', [Validators.required]),
      status: new FormControl(Status.open, [Validators.required]),
      task: new FormControl('', [Validators.required]),
    })
  }

  ngOnDestroy(): void {
    this.destroy$.complete()
  }

  // Toggle the dialog visibility and reset the form.
  public onToggleDialogAndReset() {
    this.isVisible = !this.isVisible
    this.form.reset()
  }

  // Create a new task and send it to the subject variable. Reset and hide the form.
  public onAddNewTask() {
    const newTask: Task = {
      ...this.form.value,
      dueDate: this.form.get('dueDate')?.value,
      isCompleted: false,
      isEditing: false,
      currentDate: new Date().toISOString(),
      dateCreated: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      id: Math.floor(Math.random() * 1000000).toString(),
    }

    this.taskService.addTask(newTask).pipe(takeUntil(this.destroy$), tap(() => { this.update.emit(), this.onToggleDialogAndReset() })).subscribe()
  }
}
