import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-snack-bar',
  imports: [ MatIconModule],
  templateUrl: './snack-bar.html',
  styleUrl: './snack-bar.scss'
})
export class SnackBarComponent {
constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  public snackBarRef: MatSnackBarRef<SnackBarComponent>) { }

  Close(){
    this.snackBarRef.dismiss();
  }
}
