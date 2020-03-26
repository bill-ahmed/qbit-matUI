import { Component, OnInit } from '@angular/core';

// Material UI Components
import { MatFormField } from '@angular/material/form-field';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TorrentDataStoreService } from '../services/torrent-management/torrent-data-store.service';
import { FileDirectoryExplorerService } from '../services/file-system/file-directory-explorer.service';
import { FileSystemDialogComponent } from '../file-system-dialog/file-system-dialog.component';

@Component({
  selector: 'app-add-torrent-dialog',
  templateUrl: './add-torrent-dialog.component.html',
  styleUrls: ['./add-torrent-dialog.component.css']
})
export class AddTorrentDialogComponent implements OnInit {

  public filesToUpload: FileList[] = null;
  public filesDestination = "";
  public isLoading = false;

  private fileSystemExplorerDialogREF: MatDialogRef<FileSystemDialogComponent, any>;

  constructor(private dialogRef:MatDialogRef<AddTorrentDialogComponent>, private data_store: TorrentDataStoreService, 
              private fs: FileDirectoryExplorerService, public fileSystemDialog: MatDialog) { }

  ngOnInit(): void {
    this.updateDefaultSaveLocationFromDisk();
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

  /** Update which torrents the user wants to upload. */
  updateFiles(event: any): void {
    this.filesToUpload = event.target.files;
    console.log(event.target.files);
  }

  /** Whether the Upload button should be disabled or not */
  isUploadDisabled(): boolean {
    return (this.isLoading || !this.filesToUpload || (this.filesToUpload.length === 0)); 
  }

  /** Retrieve default save location for torrents and update state */
  public updateDefaultSaveLocationFromDisk(): void {

    let save_location = "";
    let pref = localStorage.getItem('preferences');

    if(pref) {
      save_location = JSON.parse(pref).save_path;
    }

    this.filesDestination = save_location || "";
  }

  /** Callback for when user changes save location */
  public updateFileDestination(event: any): void {
    this.filesDestination = event.target.value;
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
    this.fileSystemExplorerDialogREF = this.fileSystemDialog.open(FileSystemDialogComponent, {minWidth: "50%"});

    this.fileSystemExplorerDialogREF.afterClosed().subscribe((res: any) => {
      console.log("Closed file system explorer dialog", res);
    })
  }

}
