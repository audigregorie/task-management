import { Status } from './status.enum'

export type Task = {
  dateCreated: string
  description: string
  dueDate: string
  id: string
  isCompleted: boolean
  isEditing: boolean
  status: Status
  task: string
}
