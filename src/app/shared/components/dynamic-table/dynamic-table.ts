import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-dynamic-table',
  imports: [CommonModule, MatTableModule, MatIconModule, MatTooltipModule, MatPaginatorModule],
  templateUrl: './dynamic-table.html',
  styleUrl: './dynamic-table.scss'
})
export class DynamicTable {

  @Input() tableData: any[] = [];
  @Input() displayedColumns: { key: string; label: string; }[] = [];
  @Input() actions?: { type: string; icon: string; toolTip: string }[];
  @Output() actionClick = new EventEmitter<{ actionType: string, rowData: any }>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  allColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  currency: string= 'USD';

  ngOnInit(): void {
    this.allColumns = this.displayedColumns.map(col => col.key);
    if (this.actions?.length) {
      this.allColumns.push('actions');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    if (this.tableData && this.displayedColumns) {
      this.dataSource.data = this.tableData;
      if (this.paginator) {
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      }
    }

    this.allColumns = this.displayedColumns.map(col => col.key);
    if (this.actions?.length) {
      this.allColumns.push('actions');
    }
  }

  onActionClick(actionType: string, rowData: any): void {
    this.actionClick.emit({ actionType, rowData });
  }

}
