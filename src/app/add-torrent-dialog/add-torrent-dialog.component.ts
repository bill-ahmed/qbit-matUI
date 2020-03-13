import { Component, OnInit } from '@angular/core';

// Material UI Components
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'app-add-torrent-dialog',
  templateUrl: './add-torrent-dialog.component.html',
  styleUrls: ['./add-torrent-dialog.component.css']
})
export class AddTorrentDialogComponent implements OnInit {

  public filesToUpload: FileList[] = null;
  public filesDestination = "C:\\My Folder\\Temp";
  public isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

  handleFileUpload(): void {
    this.isLoading = true;

    setTimeout(() => {this.isLoading = false}, 1000);
  }

  updateFiles(event: any): void {
    this.filesToUpload = event.target.files;
    console.log(this.filesToUpload);
  }

  isUploadDisabled(): boolean {
    return (this.isLoading || !this.filesToUpload || (this.filesToUpload.length === 0)); 
  }

}
