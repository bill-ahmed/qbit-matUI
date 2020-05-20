import { Component, OnInit } from '@angular/core';

// Material UI Components
import { MatFormField } from '@angular/material/form-field';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TorrentDataStoreService } from '../../services/torrent-management/torrent-data-store.service';
import { FileDirectoryExplorerService } from '../../services/file-system/file-directory-explorer.service';
import { FileSystemDialogComponent } from '../file-system-dialog/file-system-dialog.component';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { FileSystemService } from '../../services/file-system/file-system.service';
import { GetDefaultSaveLocation } from 'src/utils/Helpers';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-add-torrent-dialog',
  templateUrl: './add-torrent-dialog.component.html',
  styleUrls: ['./add-torrent-dialog.component.css']
})
export class AddTorrentDialogComponent implements OnInit {

  public filesToUpload: FileList[] = null;
  public urlsToUpload = "";
  public filesDestination = "";
  public isLoading = false;
  public isDarkTheme: Observable<boolean>;

  /** Keep track of the mat-tab the user is currently in. */
  private currentTab: MatTabChangeEvent;
  private fileSystemExplorerDialogREF: MatDialogRef<FileSystemDialogComponent, any>;

  constructor(private dialogRef:MatDialogRef<AddTorrentDialogComponent>, private data_store: TorrentDataStoreService,
              private fs: FileDirectoryExplorerService, public fileSystemDialog: MatDialog, private fs_service: FileSystemService, private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    this.updateDefaultSaveLocationFromDisk();
  }

  handleTabChange(event: MatTabChangeEvent) {
    this.currentTab = event;
    console.log(event);
  }

  /** Callback for all upload events. */
  handleUpload() {
    switch (this.currentTab.index) {
      case 0:
        this.handleFileUpload();
        break;

      case 1:
        this.handleMagnetURLUpload();
        break;

      default:
        break;
    }
  }

  /** Send request to server with all torrents uploaded. */
  handleFileUpload(): void {
    this.isLoading = true;
    this.data_store.UploadTorrents(this.filesToUpload, this.filesDestination)
    .then((resp: any) => {
      this.uploadFileCompletionCallback(resp);

    },
    (error: any) => {
      this.uploadFileCompletionCallback(error);
    });
  }

  /** Upload the link to a magnet URL */
  handleMagnetURLUpload(): void {

  }

  /** Update which torrents the user wants to upload. */
  updateFiles(event: any): void {
    this.filesToUpload = event.target.files;
    console.log(event.target.files);
  }

  /** Whether the Upload button should be disabled or not */
  isUploadDisabled(): boolean {
    let destinationEmpty = this.filesDestination.trim() === "";
    let urlToUploadEmpty = this.urlsToUpload.trim() === "";

    // If user in magnet url tab, check if urls and file destination is empty
    if(this.currentTab && this.currentTab.index === 1) { return destinationEmpty || urlToUploadEmpty; }
    return (this.isLoading || !this.filesToUpload || (this.filesToUpload.length === 0));
  }

  /** Retrieve default save location for torrents and update state */
  public updateDefaultSaveLocationFromDisk(): void {
    this.filesDestination = GetDefaultSaveLocation();
  }

  /** Callback for when user changes save location */
  public updateFileDestination(event: any): void {
    this.filesDestination = event.target.value;
  }

  /** Callback for when user modifies magnet urls */
  updateURLsToUpload(event: any) {
    this.urlsToUpload = event.target.value;
  }

  /** Handle cleanup for when adding torrents is completed
   * @param data Anything you want to send back to parent of this modal
   */
  private uploadFileCompletionCallback(data: any): void {
    this.isLoading = false;
    this.dialogRef.close(data);
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
