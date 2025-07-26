import { Component, inject, Input, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Task } from '../../../core/models/project.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.html',
  styleUrl: './chart.scss'
})
export class Chart {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  isLoading: boolean = false;
  @Input() displayTask: Task[] = [];
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          font: { size: 12 }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };
  public pieChartType: ChartType = 'pie';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayTask'] && this.displayTask?.length) {
      this.isLoading = true;
      this.updateChartDataFromTasks();
    }
  }

  updateChartDataFromTasks() {
    const statusColorMap: { [key: string]: string } = {
      Completed: '#4caf50',
      Inprogress: '#fbc02d',
      Assigned: '#1e88e5',
      Unassigned: '#e53935'
    };

    const statusCounts: { [key: string]: number } = {};
    this.displayTask.forEach(task => {
      const status = task.status?.trim();
      if (status) {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      }
    });

    const labels = Object.keys(statusCounts);
    const data = labels.map(status => statusCounts[status]);
    const backgroundColor = labels.map(status => statusColorMap[status] || '#9e9e9e');
    this.pieChartData = {
      labels,
      datasets: [{ data, backgroundColor }]
    };
    this.isLoading = false;
  }
}
