import { Component, OnInit } from '@angular/core';

import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FileSystemDialogComponent } from '../file-system-dialog/file-system-dialog.component';
import { ThemeService } from '../../services/theme.service';
import { FileSystemService } from '../../services/file-system/file-system.service';
import { Observable } from 'rxjs';
import { FileDirectoryExplorerService } from 'src/app/services/file-system/file-directory-explorer.service';
import { GetDefaultSaveLocation } from 'src/utils/Helpers';
import { RowSelectionService } from 'src/app/services/torrent-management/row-selection.service';
import { TorrentDataStoreService } from 'src/app/services/torrent-management/torrent-data-store.service';
import { Torrent } from 'src/utils/Interfaces';
import { SnackbarService } from 'src/app/services/notifications/snackbar.service';

@Component({
  selector: 'app-move-torrents-dialog',
  templateUrl: './move-torrents-dialog.component.html',
  styleUrls: ['./move-torrents-dialog.component.css']
})
export class MoveTorrentsDialogComponent implements OnInit {

  public torrents: Torrent[] = [];
  public isLoading = false
  public filesDestination = "";
  public showListofTorrents = false;
  public isDarkTheme: Observable<boolean>;

  public allSaveLocations: string[] = [];

  private fileSystemExplorerDialogREF: MatDialogRef<FileSystemDialogComponent, any>;

  constructor(public fileSystemDialog: MatDialog, private data_store: TorrentDataStoreService,
              private theme: ThemeService, private torrentsSelected: RowSelectionService, private fsService: FileSystemService,
              private snackbar: SnackbarService, private dialogRef:MatDialogRef<MoveTorrentsDialogComponent>) { }

  ngOnInit(): void {
    let torrent_ids = this.torrentsSelected.getTorrentsSelectedValue();

    this.filesDestination = GetDefaultSaveLocation();

    this.torrents = this.data_store.GetTorrentsByIDs(torrent_ids);
    this.torrents.sort((a, b) => a.name > b.name ? 1 : -1);

    this.allSaveLocations = this.data_store.GetAllSaveLocations();

    this.isDarkTheme = this.theme.getThemeSubscription();
  }

  moveTorrents() {
    this.isLoading = true;
    this.data_store.MoveTorrents(this.torrents, this.filesDestination)
    .subscribe(
    res => { this.snackbar.enqueueSnackBar(`Successfully moved ${this.torrents.length} torrent(s).`, { type: 'success' }) }
    ,
    err => {
      this.snackbar.enqueueSnackBar('Failed to move torrent(s). Check console logs!', { type: 'error' });
      console.error("Error moving torrents", err);
    },
    () => { this.dialogRef.close(); })           // Completion callback
  }

  /** Get names of torrents to move */
  torrentsToMove(): string[] {
    return this.torrents.map(tor => tor.name);
  }

  /** Toggle showing names of all torrents in a list */
  toggleTorrentsList(event: any) {
    this.showListofTorrents = !this.showListofTorrents;
  }

  /** Callback for when user changes save location */
  public updateFileDestination(event: any): void {
    this.filesDestination = event.target.value;
  }

  /** Handle opening file explorer dialog & handling any callbacks */
  public openFileSystemExplorerDialog(event: any): void {
    this.fileSystemExplorerDialogREF = this.fileSystemDialog.open(FileSystemDialogComponent,
      {minWidth: "50%", panelClass: "generic-dialog", autoFocus: false, data: { initialFilePath: this.filesDestination }});

    this.fileSystemExplorerDialogREF.afterClosed().subscribe((res: string) => {
      // If use confirmed choice of file path
      if(res) {
        const delim = this.fsService.getFileSystemDelimeter()
        if (delim === '/') res = '/' + res
        this.filesDestination = res
      }
    })
  }

}
