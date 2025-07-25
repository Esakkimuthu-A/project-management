import { Component, inject } from '@angular/core';
import { DynamicTable } from '../../../shared/components/dynamic-table/dynamic-table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskActions, TaskDisplayedColumnNames } from '../../constands/project.constant';
import { Task } from '../../models/project.model';
import { SkeletonLoader } from '../../../shared/components/skeleton-loader/skeleton-loader';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../../../shared/components/task-form/task-form';
import { Shared } from '../../../shared/services/shared';
import { Dialog } from '../../../shared/services/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { formatTaskDateForDb } from '../../../shared/utils/common-utils';
import { SnackBar, SnackType } from '../../../shared/services/snack-bar';
import moment from 'moment';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatIconModule, DynamicTable, SkeletonLoader, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss'
})
export class Tasks {
  isLoading: boolean = false;
  actions = TaskActions;
  displayedColumnNames = TaskDisplayedColumnNames;
  private dialog = inject(MatDialog);
  displayTask: Task[] = [];

  constructor(private sharedService: Shared, private dialogService: Dialog, private snackBarService: SnackBar) { }

  ngOnInit() {
    this.getTasks();
  }

  async getTasks() {
    this.isLoading = true;
    try {
      const { data, error } = await this.sharedService.getTasks();
      if (error) {
        console.error('Error fetching resources:', error);
      }
      this.displayTask = (data || []).map(task => ({
        ...task,
        startDate: moment(task.startDate).format('DD-MM-YYYY'),
        endDate: moment(task.endDate).format('DD-MM-YYYY')
      }));
    } catch (e) {
      this.snackBarService.openSnackBar({ message: 'Unexpected error',main: SnackType.Error});
      console.error('Unexpected error:', e);
    } finally {
      this.isLoading = false;
    }
  }

  addNewTask(): void {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '400px',
      disableClose: true,
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const displayDates = formatTaskDateForDb(result);
        this.addUserTask(displayDates);
      }
    });
  }

  async addUserTask(element: Task) {
    this.isLoading = true;
    try {
      const { data, error } = await this.sharedService.addTasks(element);
      if (error) {
        console.error('Error adding user data:', error);
        // Optionally show error to user using snackbar/toast
        return;
      }
      if (data) {
        this.getTasks();
      }
    } catch (err) {
      this.snackBarService.openSnackBar({ message: 'Unexpected error',main: SnackType.Error});
      console.error('Unexpected error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  handleAction(event: { actionType: string, rowData: any }): void {
    const { actionType, rowData } = event;
    switch (actionType) {
      case 'edit':
        this.openDialog('edit', rowData);
        break;
      case 'delete':
        this.deleteTask(rowData);
        break;
      case 'visibility':
        this.openDialog('view', rowData);
        break;
      default:
        console.warn(`Unhandled action type: ${actionType}`);
    }
  }

  openDialog(mode: 'edit' | 'view', data?: Task): void {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '400px',
      disableClose: true,
      data: { mode, task: data }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (mode === 'edit') {
          if (data?.id) {
            const displayDates = formatTaskDateForDb(result);
            const updatedTask = {
              ...displayDates,
              id: data.id
            };
            this.isLoading = true;
            const { data: updatedData, error } = await this.sharedService.editTask(updatedTask);
            if (updatedData) {
              this.getTasks();
            }
            else {
              this.isLoading = false;
              this.snackBarService.openSnackBar({ message: 'Update failed',main: SnackType.Error});
              console.error('Update failed:', error);
            }
          }
        }
      }
    });
  }

  async deleteTask(element: Task) {
    const dialogRef = this.dialogService.openConfirmationDialog("You have unsaved changes. Are you sure you want to leave this page?");
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        const { error } = await this.sharedService.deleteTask(element.id);
        if (error) {
          this.snackBarService.openSnackBar({ message: error.message, main: SnackType.Error });
          this.isLoading = false;
        } else {
          this.snackBarService.openSnackBar({ message: "Deleted Successfully", main: SnackType.Success });
          this.getTasks();
        }
      }
    });
  }
}
