import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar';

export interface SnackBarData {
  message: string;
  duration?: number;
  main: SnackType;
}

export enum SnackType {
  Success, Error, Info, Warning, Default
}

@Injectable({
  providedIn: 'root'
})
export class SnackBar {
  constructor(private _snackBar: MatSnackBar) { }

  details = [
    { type: SnackType.Success, event: "check_circle_outline", panelClass: 'snackbar-success' },
    { type: SnackType.Error, event: "highlight_off", panelClass: 'snackbar-error' },
    { type: SnackType.Warning, event: 'warning', panelClass: 'snackbar-warning' },
    { type: SnackType.Info, event: 'touch_app', panelClass: 'snackbar-info' },
    { type: SnackType.Default, event: 'settings_backup_restore', panelClass: 'snackbar-default' },
  ];

  openSnackBar(input: SnackBarData): void {
    const property = this.details.find(x => x.type === input.main);
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: input.duration ?? 200000,
      data: {
        header: input.message,
        content: property?.event
      },
      verticalPosition: 'bottom',
      panelClass: property?.panelClass
    });
  }
}
