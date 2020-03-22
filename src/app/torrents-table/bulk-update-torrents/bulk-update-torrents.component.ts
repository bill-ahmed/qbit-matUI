import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { Torrent } from 'src/utils/Interfaces';
import { RowSelectionService } from 'src/app/services/torrent-management/row-selection.service';

@Component({
  selector: 'app-bulk-update-torrents',
  templateUrl: './bulk-update-torrents.component.html',
  styleUrls: ['./bulk-update-torrents.component.css']
})
export class BulkUpdateTorrentsComponent implements OnInit {

  public torrentsSelected: string[] = [];

  constructor(private snackbarREF: MatSnackBarRef<BulkUpdateTorrentsComponent>, private torrentsSelectedService: RowSelectionService) { }

  ngOnInit(): void {

    // Update state when new torrents are selected/un-selected
    this.torrentsSelectedService
    .getTorrentsSelected()
    .subscribe((newTorrents: string[]) => {
      
      this.torrentsSelected = newTorrents;
    })
  }

  /** Get appropriate message to display in snackbar */
  public getSnackbarMessage(): string {
    let numTorrentsSelected = this.torrentsSelected.length;

    return numTorrentsSelected === 1 ? 
        `1 torrent selected.` : `${numTorrentsSelected} torrents selected.`;
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
