import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { TorrentDataStoreService } from 'src/app/services/torrent-management/torrent-data-store.service';
import { SnackbarService } from 'src/app/services/notifications/snackbar.service';
import { UnitsHelperService } from 'src/app/services/units-helper.service';

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

  constructor(private data_store: TorrentDataStoreService, private snackbar: SnackbarService, private units: UnitsHelperService,
              private dialogRef: MatDialogRef<RateLimitsDialogComponent>, private theme: ThemeService, @Inject(MAT_DIALOG_DATA) inputData)
              {
                this.inputData = inputData
              }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    this.newLimit = this.inputData.currentLimit
  }

  async updateLimit() {
    this.isLoading = true;

    switch (this.inputData.for) {
      case 'Download':
        await this.data_store.SetGlobalDownloadLimit(this.units.Kibibits_to_bits(this.newLimit));
        break;

      case 'Upload':
        await this.data_store.SetGlobalUploadLimit(this.units.Kibibits_to_bits(this.newLimit));
        break;

      default:
        this.snackbar.enqueueSnackBar(`Unknown limit update type ${this.inputData.for}!`, { type: 'error' });
        break;
    }

    this.dialogRef.close();
  }

}
