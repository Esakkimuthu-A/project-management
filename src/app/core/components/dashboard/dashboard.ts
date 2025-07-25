import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from '../../../shared/components/chart/chart';
import { DynamicTable } from '../../../shared/components/dynamic-table/dynamic-table';
import { DashboardTaskDisplayedColumnNames } from '../../constands/project.constant';
import { Shared } from '../../../shared/services/shared';
import { Task } from '../../models/project.model';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackBar, SnackType } from '../../../shared/services/snack-bar';
import { SkeletonLoader } from '../../../shared/components/skeleton-loader/skeleton-loader';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, Chart, DynamicTable, MatSelectModule, SkeletonLoader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  displayedColumnNames = DashboardTaskDisplayedColumnNames;
  isLoading: boolean = false;
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  statusOptions: string[] = ['All', 'Unassigned', 'Assigned', 'Inprogress', 'Completed'];
  selectedStatus: string = 'All';

  constructor(private sharedService: Shared, private snackBarService:SnackBar) { }

  ngOnInit() {
    this.getTasks();
  }

  async getTasks() {
    this.isLoading = true;
    try {
      const { data, error } = await this.sharedService.getTasks();
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }
      this.allTasks = (data || []).map(task => ({
        ...task,
        startDate: moment(task.startDate).format('DD-MM-YYYY'),
        endDate: moment(task.endDate).format('DD-MM-YYYY')
      }));
      this.filterTasks();
    } catch (e) {
      this.snackBarService.openSnackBar({ message: 'Unexpected error',main: SnackType.Error});
      console.error('Unexpected error:', e);
    } finally {
      this.isLoading = false;
    }
  }

  filterTasks() {
    if (this.selectedStatus === 'All') {
      this.filteredTasks = [...this.allTasks];
    } else {
      this.filteredTasks = this.allTasks.filter(
        task => task.status === this.selectedStatus
      );
    }
  }

}
