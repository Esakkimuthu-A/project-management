import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { TaskStatus } from '../../../core/constands/project.constant';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMATS
    }
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm {
  taskForm!: FormGroup;
  mode: 'add' | 'edit' | 'view' = 'add';
  taskStatus = TaskStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskForm>
  ) { }

  ngOnInit(): void {
    this.mode = this.data?.mode || 'add';
    this.taskForm = this.fb.group({
      task: [this.data?.task?.task || '', Validators.required],
      startDate: [
        this.data?.task?.startDate ? moment(this.data.task.startDate, 'DD-MM-YYYY') : '',
        Validators.required
      ],
      endDate: [
        this.data?.task?.endDate ? moment(this.data.task.startDate, 'DD-MM-YYYY') : '',
        Validators.required
      ],
      status: this.fb.control(
        { value: this.data?.task?.status || 'Unassigned', disabled: this.mode !== 'edit' || this.data?.task?.status === 'Unassigned' },
        Validators.required
      )
    });

    if (this.mode === 'view') {
      this.taskForm.disable();
    }
  }

  getEndDateFilter = (date: Date | null): boolean => {
    const start: Date | null = this.taskForm.get('startDate')?.value;
    if (!start || !date) {
      return false;
    }
    return date >= start;
  };

  onSave() {
    const formData = this.taskForm.getRawValue();
    this.dialogRef.close(formData);
  }
}

