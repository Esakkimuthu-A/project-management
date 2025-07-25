import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  imports: [CommonModule],
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.scss'
})
export class SkeletonLoader {
  columnCount: number = 5;
  rowCount: number = 5;

  get rows() {
    return Array(this.rowCount);
  }

  get columns() {
    return Array(this.columnCount);
  }
}
