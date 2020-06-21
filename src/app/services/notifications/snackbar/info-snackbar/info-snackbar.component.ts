import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-info-snackbar',
  templateUrl: './info-snackbar.component.html',
  styleUrls: ['./info-snackbar.component.css']
})
export class InfoSnackbarComponent implements OnInit {
  public message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) private data: any, public snackBarRef: MatSnackBarRef<InfoSnackbarComponent>) { this.message = this.data.message; }

  ngOnInit(): void { }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
