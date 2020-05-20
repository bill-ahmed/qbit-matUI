import { Component, OnInit } from '@angular/core';

import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FileSystemDialogComponent } from '../file-system-dialog/file-system-dialog.component';
import { ThemeService } from '../../services/theme.service';
import { FileSystemService } from '../../services/file-system/file-system.service';
import { Observable } from 'rxjs';
import { FileDirectoryExplorerService } from 'src/app/services/file-system/file-directory-explorer.service';

@Component({
  selector: 'app-move-torrents-dialog',
  templateUrl: './move-torrents-dialog.component.html',
  styleUrls: ['./move-torrents-dialog.component.css']
})
export class MoveTorrentsDialogComponent implements OnInit {

  public filesDestination = "";
  public isDarkTheme: Observable<boolean>;

  private fileSystemExplorerDialogREF: MatDialogRef<FileSystemDialogComponent, any>;

  constructor(private fs: FileDirectoryExplorerService, public fileSystemDialog: MatDialog, private fs_service: FileSystemService, private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
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
