import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileDirectoryExplorerService } from '../services/file-system/file-directory-explorer.service';

@Component({
  selector: 'app-file-system-dialog',
  templateUrl: './file-system-dialog.component.html',
  styleUrls: ['./file-system-dialog.component.css']
})
export class FileSystemDialogComponent implements OnInit {

  public filePath: string = "PATH/TO/DOWNLOAD";
  public rootFolders: string[] = [];              // Keep track of what folders to show in left nav
  public rootFolderChildren: string[] = [];       // Keep track of what folders to show in right nav

  constructor(private dialogRef:MatDialogRef<FileSystemDialogComponent>, private fs: FileDirectoryExplorerService) { }

  ngOnInit(): void {
    let root = this.fs.getFileSystem();
    let rootDirs = root.getChildren().map(elem => {return elem.getValue()}).sort();
    this.rootFolders = rootDirs;
  }

  public closeDialog(): void {
    this.dialogRef.close(this.filePath);
  }

  /** Go to chosen child directory */
  public navigateToDir(dir: string): void {

  }

}
