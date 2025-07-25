import moment from 'moment';
import { Task } from '../../core/models/project.model';

export function formatTaskDateForDb(task: Task): Task {
  return {
    ...task,
    startDate: moment(task.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    endDate: moment(task.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
  };
}