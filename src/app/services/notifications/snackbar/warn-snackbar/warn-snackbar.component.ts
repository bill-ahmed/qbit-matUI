import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-warn-snackbar',
  templateUrl: './warn-snackbar.component.html',
  styleUrls: ['./warn-snackbar.component.css']
})
export class WarnSnackbarComponent implements OnInit {
  public message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: any, public snackBarRef: MatSnackBarRef<WarnSnackbarComponent>) { this.message = this.data.message; }

  ngOnInit(): void { }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
