import { Component, OnInit } from '@angular/core';

// Material UI Components
import { MatFormField } from '@angular/material/form-field';
import { TorrentDataService } from '../torrent-data.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-torrent-dialog',
  templateUrl: './add-torrent-dialog.component.html',
  styleUrls: ['./add-torrent-dialog.component.css']
})
export class AddTorrentDialogComponent implements OnInit {

  public filesToUpload: FileList[] = null;
  public filesDestination = "C:\\My Folder\\Temp";
  public isLoading = false;

  constructor(private dialogRef:MatDialogRef<AddTorrentDialogComponent>, private TorrentService: TorrentDataService) { }

  ngOnInit(): void {
    this.updateDefaultSaveLocation();
  }

  /** Send request to server with all torrents uploaded. */
  handleFileUpload(): void {
    this.isLoading = true;
    this.TorrentService.UploadNewTorrents(this.filesToUpload)
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
  public updateDefaultSaveLocation(): void {

    let save_location = "";
    let pref = localStorage.getItem('preferences');

    if(pref) {
      save_location = JSON.parse(pref).save_path;
    }

    this.filesDestination = save_location || "";
  }

  /** Handle cleanup for when adding torrents is completed
   * @param data Anything you want to send back to parent of this modal
   */
  private uploadFileCompletionCallback(data: any): void {
    this.isLoading = false;
    this.dialogRef.close(data);
  }

}
