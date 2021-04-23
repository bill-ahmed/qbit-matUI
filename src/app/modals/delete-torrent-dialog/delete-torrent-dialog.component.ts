import { Component, OnInit, Inject } from '@angular/core';

// Material UI Components
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

// Helpers
import { TorrentDataHTTPService } from '../../services/torrent-management/torrent-data-http.service';
import { Torrent } from 'src/utils/Interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/services/notifications/snackbar.service';

@Component({
  selector: 'app-delete-torrent-dialog',
  templateUrl: './delete-torrent-dialog.component.html',
  styleUrls: ['./delete-torrent-dialog.component.css']
})

export class DeleteTorrentDialogComponent implements OnInit {

  public torrentsToDelete: Torrent[];
  public deleteFilesOnDisk = false;
  public isLoading = false;
  private attemptedDelete = false;  // Keep track of whether any deletes were attempted
  public isDarkTheme: Observable<boolean>;

  constructor(private dialogRef:MatDialogRef<DeleteTorrentDialogComponent>, private TorrentService: TorrentDataHTTPService, @Inject(MAT_DIALOG_DATA) data,
              private snackbar: SnackbarService, private theme: ThemeService) {
    this.torrentsToDelete = data.torrent;
   }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
  }

  updateDeleteFilesFromDisk(event: MatCheckboxChange): void {
    this.deleteFilesOnDisk = event.checked;
  }

  /** Delete a torrent
   * @param tor: The torrent in question.
   */
  handleTorrentDelete(): void {
    this.isLoading = true;
    this.attemptedDelete = true;

    this.TorrentService.DeleteTorrent(this.torrentsToDelete.map((elem) => elem.hash), this.deleteFilesOnDisk)
    .subscribe(
    (res: any) => {
      this.snackbar.enqueueSnackBar(`Successfully deleted ${this.torrentsToDelete.length} torrent(s)`, { type: 'warn' });
      this.finishCallback(res);

    },
    (error: any) => {
      console.error(error);
      this.snackbar.enqueueSnackBar("Error deleting torrent(s). Check the console logs!", { type: 'error' })
      this.finishCallback(error);

    });
  }

  finishCallback(resp: any): void {
    this.dialogRef.close({attemptedDelete: this.attemptedDelete});
  }
}
