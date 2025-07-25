import { Component, inject } from '@angular/core';
import { DynamicTable } from '../../../shared/components/dynamic-table/dynamic-table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ResourceForm } from '../../../shared/components/resource-form/resource-form';
import { ReasourceDisplayedColumnNames, ResourceAction } from '../../constands/project.constant';
import { Resource } from '../../models/project.model';
import { Shared } from '../../../shared/services/shared';
import { SkeletonLoader } from '../../../shared/components/skeleton-loader/skeleton-loader';
import { CommonModule } from '@angular/common';
import { Dialog } from '../../../shared/services/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackBar, SnackType } from '../../../shared/services/snack-bar';
import { AssignTask } from '../../../shared/components/assign-task/assign-task';

@Component({
  selector: 'app-resources',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, DynamicTable, CommonModule, SkeletonLoader, MatSelectModule, ReactiveFormsModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class Resources {
  isLoading: boolean = false;
  actions = ResourceAction;
  displayedColumnNames = ReasourceDisplayedColumnNames;
  displayDetails: Resource[] = [];
  private dialog = inject(MatDialog);
  dialogRef!: MatDialogRef<any>;

  constructor(private sharedService: Shared, private dialogService: Dialog, private snackBarService: SnackBar) { }

  ngOnInit() {
    this.getResources();
  }

  async getResources() {
    this.isLoading = true;
    try {
      const { data, error } = await this.sharedService.getResources();
      if (error) {
        console.error('Error fetching resources:', error);
      }
      this.displayDetails = data || [];
    } catch (e) {
      this.snackBarService.openSnackBar({ message: 'Unexpected error',main: SnackType.Error});
      console.error('Unexpected error:', e);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Handles the emitted action event from the dynamic table and routes it to the respective function (edit, delete, view)
   * @param event Resources data
   */
  handleAction(event: { actionType: string, rowData: any }): void {
    const { actionType, rowData } = event;
    switch (actionType) {
      case 'edit':
        this.openDialog('edit', rowData);
        break;
      case 'delete':
        this.deleteResource(rowData);
        break;
      case 'visibility':
        this.openDialog('view', rowData);
        break;
      default:
        console.warn(`Unhandled action type: ${actionType}`);
    }
  }

  /**
   * Opens a modal to assign a task to selected resources.
   */
  assignTask(): void {
    const dialogRef = this.dialog.open(AssignTask, {
      width: '400px',
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getResources();
      }
    })
  }

  openDialog(mode: 'edit' | 'view', data?: Resource): void {
    const dialogRef = this.dialog.open(ResourceForm, {
      width: '400px',
      disableClose: true,
      data: { mode, resource: data }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (mode === 'edit') {
          if (data?.id) {
            this.isLoading = true;
            const updatedTask = {
              ...result,
              id: data.id
            };
            const { data: updatedData, error } = await this.sharedService.editResource(updatedTask);
            if (updatedData) {
              this.getResources();
            } else {
              this.isLoading = false;
              this.snackBarService.openSnackBar({ message: 'Update failed',main: SnackType.Error});
              console.error('Update failed:', error);
            }
          }
        }
      }
    });
  }

  /**
   * Opens a dialog to add a new resource.
   */
  addNewResource(): void {
    const dialogRef = this.dialog.open(ResourceForm, {
      width: '400px',
      disableClose: true,
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.addUserData(result);
      }
    });
  }

  /**
   * Adds a new resource to Supabase
   */
  async addUserData(result: Resource) {
    try {
      const { data, error } = await this.sharedService.addResources(result);
      if (error) {
        console.error('Error adding user data:', error);
        // Optionally show error to user using snackbar/toast
        return;
      }
      if (data) {
        this.getResources();
      }
    } catch (err) {
      this.snackBarService.openSnackBar({ message: 'Unexpected error',main: SnackType.Error});
      console.error('Unexpected error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Deletes a resource from Supabase and updates the local data list.
   * @param element - The resource object
   */
  deleteResource(element: Resource) {
    const dialogRef = this.dialogService.openConfirmationDialog(`Are you sure you want to delete "${element.name}"?`);
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        this.isLoading = true;
        const { error } = await this.sharedService.deleteResource(element.id);
        if (error) {
          this.snackBarService.openSnackBar({ message: error.message,main: SnackType.Error});
          this.isLoading = false;
        } else {
          this.snackBarService.openSnackBar({ message: "Deleted Successfully",main: SnackType.Success});
          this.getResources();
        }
      }
    });
  }

}
