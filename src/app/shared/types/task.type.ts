import { Status } from './status.enum'

export type Task = {
  id: string
  task: string
  description: string
  status: Status
  isEditing: boolean
  isCompleted: boolean
  dateCreated: string
  dueDate: string
}
