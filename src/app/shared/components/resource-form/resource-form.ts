import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ResourceStatus } from '../../../core/constands/project.constant';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-resource-form',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, CommonModule, MatButtonModule, MatSelectModule],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.scss'
})
export class ResourceForm {
  resourceForm!: FormGroup;
  mode: 'add' | 'edit' | 'view' = 'add';

  status=ResourceStatus;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.mode = this.data?.mode || 'add';
    this.resourceForm = this.fb.group({
      name: [this.data?.resource?.name || '', Validators.required],
      email: [this.data?.resource?.email || '', [Validators.required, Validators.email]],
      status: [this.data?.resource?.status || '', Validators.required],
      cost: [ this.data?.resource?.cost ?? '', [Validators.required, Validators.pattern(/^[0-9]+$/)] ]
    });
    if (this.mode === 'view') {
      this.resourceForm.disable();
    }
  }

}
