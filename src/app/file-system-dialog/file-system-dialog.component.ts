import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileDirectoryExplorerService } from '../services/file-system/file-directory-explorer.service';

@Component({
  selector: 'app-file-system-dialog',
  templateUrl: './file-system-dialog.component.html',
  styleUrls: ['./file-system-dialog.component.css']
})
export class FileSystemDialogComponent implements OnInit {

  public filePath: string = "PATH/TO/DOWNLOAD"

  constructor(private dialogRef:MatDialogRef<FileSystemDialogComponent>, private fs: FileDirectoryExplorerService) { }

  ngOnInit(): void {
  }

  public closeDialog(): void {
    this.dialogRef.close(this.filePath);
  }

}
