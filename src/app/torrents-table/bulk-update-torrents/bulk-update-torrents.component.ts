import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Torrent } from 'src/utils/Interfaces';

@Component({
  selector: 'app-bulk-update-torrents',
  templateUrl: './bulk-update-torrents.component.html',
  styleUrls: ['./bulk-update-torrents.component.css']
})
export class BulkUpdateTorrentsComponent implements OnInit {

  public numTorrentsSelected: number = 0;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public torData: Torrent[], private snackbarREF: MatSnackBarRef<BulkUpdateTorrentsComponent>) { }

  ngOnInit(): void {
    this.numTorrentsSelected = this.torData.length;
  }

  /** Get appropriate message to display in snackbar */
  public getSnackbarMessage(): string {
    return this.numTorrentsSelected === 1 ? 
        `1 torrent selected.` : `${this.numTorrentsSelected} torrents selected.`;
  }

  /** Programtically close the snackbar.
   * @param withAction Whether the snackbar was dismissed with an action or not.
   */
  handleSnackbarClose(withAction: boolean): void {
    withAction ? this.snackbarREF.dismissWithAction() : this.snackbarREF.dismiss();
  }

  /** Callback for when user chooses to cancel bulk deleting torrents */
  handleCancelAction(): void {
    this.handleSnackbarClose(false);
  }

  /** Callback for when user chooses to delete torrents */
  handleDeleteAction(): void {
    this.handleSnackbarClose(true);
  }

}
