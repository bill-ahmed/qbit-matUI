import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { UnitsHelperService } from 'src/app/services/units-helper.service';

@Component({
  selector: 'app-statistics-dialog',
  templateUrl: './statistics-dialog.component.html',
  styleUrls: ['./statistics-dialog.component.css']
})
export class StatisticsDialogComponent implements OnInit {
  public isDarkTheme: Observable<boolean>;
  public inputData: any;                   // Data passed in to this component
  
  constructor(private theme: ThemeService, public units_helper: UnitsHelperService, @Inject(MAT_DIALOG_DATA) inputData) { 
    this.inputData = inputData;
  }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
  }

}
