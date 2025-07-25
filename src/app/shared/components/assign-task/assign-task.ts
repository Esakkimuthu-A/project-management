import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { Shared } from '../../services/shared';
import { MatButtonModule } from '@angular/material/button';
import { Resource, Task } from '../../../core/models/project.model';

@Component({
  selector: 'app-assign-task',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './assign-task.html',
  styleUrl: './assign-task.scss'
})
export class AssignTask {
  assignForm!: FormGroup;
  availableResource: Resource[] = [];

  unassignedTask: Task[] = []

  constructor(private fb: FormBuilder, private sharedService: Shared) { }

  ngOnInit() {
    this.formInitial()
  }

  formInitial() {
    this.assignForm = this.fb.group({
      unassignedResource: [null, Validators.required],
      allResource: [null, Validators.required]
    });
    this.getResources();
    this.getTasks();
  }

  async getResources(): Promise<void> {
    try {
      const { data, error } = await this.sharedService.getResources();

      if (error) {
        console.error('Error fetching resources:', error);
        this.availableResource = [];
        return;
      }
      this.availableResource = (data ?? []).filter(task => task.status === 'Available');
    } catch (e) {
      console.error('Unexpected error while fetching resources:', e);
      this.availableResource = [];
    }
  }

  async getTasks(): Promise<void> {
    try {
      const { data, error } = await this.sharedService.getTasks();

      if (error) {
        console.error('Error fetching tasks:', error);
        this.unassignedTask = [];
        return;
      }
      this.unassignedTask = (data ?? []).filter(task => task.status === 'Unassigned');
    } catch (e) {
      console.error('Unexpected error while fetching tasks:', e);
      this.unassignedTask = [];
    }
  }

  async onAssign() {
    const selectedResource: Resource = this.assignForm.value.unassignedResource;
    const selectedTask: Task = this.assignForm.value.allResource;
    const updatedResource: Resource = {
      ...selectedResource,
      status: 'Unavailable'
    };
    const updatedTask: Task = {
      ...selectedTask,
      status: 'Assigned',
    };

    try {
      const { error: resourceError } = await this.sharedService.editResource(updatedResource);
      if (resourceError) throw new Error('Failed to update resource');

      const { error: taskError } = await this.sharedService.editTask(updatedTask);
      if (taskError) throw new Error('Failed to update task');

    } catch (error) {
      console.error('Assignment failed:', error);
    }
  }

}
