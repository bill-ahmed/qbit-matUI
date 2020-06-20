import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls: ['./error-snackbar.component.css']
})
export class ErrorSnackbarComponent implements OnInit {
  public message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: any, public snackBarRef: MatSnackBarRef<ErrorSnackbarComponent>) { this.message = this.data.message; }

  ngOnInit(): void { }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
