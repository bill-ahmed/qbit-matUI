import { Component, OnInit, Inject } from '@angular/core';

// Material UI Components
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

// Helpers
import { TorrentDataService } from '../services/torrent-data-http.service';
import { Torrent } from 'src/utils/Interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-torrent-dialog',
  templateUrl: './delete-torrent-dialog.component.html',
  styleUrls: ['./delete-torrent-dialog.component.css']
})

export class DeleteTorrentDialogComponent implements OnInit {

  public torrentToDelete: Torrent;
  public deleteFilesOnDisk = false;
  public isLoading = false;
  private attemptedDelete = false;  // Keep track of whether any deletes were attempted

  constructor(private dialogRef:MatDialogRef<DeleteTorrentDialogComponent>, private TorrentService: TorrentDataService, @Inject(MAT_DIALOG_DATA) data) { 
    this.torrentToDelete = data.torrent;
   }

  ngOnInit(): void {
    console.log(this.torrentToDelete.name);
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

    this.TorrentService.DeleteTorrent(this.torrentToDelete.hash, this.deleteFilesOnDisk)
    .subscribe(
    (res: any) => {
      console.log(res);
      this.finishCallback(res);

    }, 
    (error: any) => {
      console.error(error);
      this.finishCallback(error);

    });
  }

  finishCallback(resp: any): void {
    console.log(resp);
    this.dialogRef.close({attemptedDelete: this.attemptedDelete});
  }
}
