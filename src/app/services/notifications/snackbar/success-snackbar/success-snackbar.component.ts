import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-success-snackbar',
  templateUrl: './success-snackbar.component.html',
  styleUrls: ['./success-snackbar.component.css']
})
export class SuccessSnackbarComponent implements OnInit {

  public message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: any, public snackBarRef: MatSnackBarRef<SuccessSnackbarComponent>) { this.message = this.data.message; }

  ngOnInit(): void { }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
