import { Pipe, PipeTransform } from '@angular/core'
import { Task } from '../types/task.type'
import { Status } from '../types/status.enum'

@Pipe({
  name: 'filterStatus',
})
export class FilterStatusPipe implements PipeTransform {
  transform(value: any, filteredStatus?: Status): Task[] {
    if (!value || value.length === 0) {
      return value
    }

    if (!filteredStatus) {
      return value
    }

    return value.filter((task: Task) => task.status === filteredStatus)
  }
}
