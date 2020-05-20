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

@Component({
  selector: 'app-move-torrents-dialog',
  templateUrl: './move-torrents-dialog.component.html',
  styleUrls: ['./move-torrents-dialog.component.css']
})
export class MoveTorrentsDialogComponent implements OnInit {

  public filesDestination = "";
  public isDarkTheme: Observable<boolean>;
  public torrents: Torrent[] = [];

  private fileSystemExplorerDialogREF: MatDialogRef<FileSystemDialogComponent, any>;

  constructor(public fileSystemDialog: MatDialog, private data_store: TorrentDataStoreService,
              private theme: ThemeService, private torrentsSelected: RowSelectionService) { }

  ngOnInit(): void {
    let torrent_ids = this.torrentsSelected.getTorrentsSelectedValue();

    this.filesDestination = GetDefaultSaveLocation();
    this.torrents = this.data_store.GetTorrentsByIDs(torrent_ids);
    this.isDarkTheme = this.theme.getThemeSubscription();
  }

  /** Get names of torrents to move */
  torrentsToMove(): string[] {
    return this.torrents.map(tor => tor.name);
  }

  toggleTorrentsList(event: any) {

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
        this.filesDestination = res
      }
    })
  }

}
