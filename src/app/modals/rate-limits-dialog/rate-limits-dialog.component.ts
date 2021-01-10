import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rate-limits-dialog',
  templateUrl: './rate-limits-dialog.component.html',
  styleUrls: ['./rate-limits-dialog.component.css']
})
export class RateLimitsDialogComponent implements OnInit {
  public newLimit: number;

  public isDarkTheme: Observable<boolean>;
  public isLoading = false;

  public inputData: any;                   // Data passed in to this component

  constructor(private theme: ThemeService, @Inject(MAT_DIALOG_DATA) inputData) { this.inputData = inputData }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    this.newLimit = this.inputData.currentLimit
  }

  async updateLimit() {
    this.isLoading = true;
  }

}
