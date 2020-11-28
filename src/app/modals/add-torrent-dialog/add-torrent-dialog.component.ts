import { Component, OnInit } from '@angular/core';

// Material UI Components
import { MatFormField } from '@angular/material/form-field';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TorrentDataStoreService } from '../../services/torrent-management/torrent-data-store.service';
import { FileSystemDialogComponent } from '../file-system-dialog/file-system-dialog.component';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { SerializedNode } from '../../services/file-system/file-system.service';
import { GetDefaultSaveLocation } from 'src/utils/Helpers';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TorrentParserService } from 'src/app/services/torrent-management/torrent-parser.service';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { WebUIUploadingSettings } from 'src/utils/Interfaces';
import { SnackbarService } from 'src/app/services/notifications/snackbar.service';

@Component({
  selector: 'app-add-torrent-dialog',
  templateUrl: './add-torrent-dialog.component.html',
  styleUrls: ['./add-torrent-dialog.component.scss']
})
export class AddTorrentDialogComponent implements OnInit {
  public show_torrent_contents: boolean;

  public filesToUpload: FileList[] = null;
  public urlsToUpload = "";
  public filesDestination = "";

  public isLoading = false;
  public isTreeExplorerReady = false;
  public isDarkTheme: Observable<boolean>;

  public serialized_nodes: SerializedNode[] = [];

  /** Keep track of the mat-tab the user is currently in. */
  private currentTab: MatTabChangeEvent;
  private fileSystemExplorerDialogREF: MatDialogRef<FileSystemDialogComponent, any>;

  constructor(private appConfig: ApplicationConfigService, private dialogRef:MatDialogRef<AddTorrentDialogComponent>, private data_store: TorrentDataStoreService,
              private torrentParser: TorrentParserService, public fileSystemDialog: MatDialog, public snackbar: SnackbarService, private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    this.updateDefaultSaveLocationFromDisk();
    this.appConfig.getUserPreferences().then(pref => { this.show_torrent_contents = pref.web_ui_options.upload_torrents?.show_parsed_torrents_from_file ?? true });
  }

  handleTabChange(event: MatTabChangeEvent) {
    this.currentTab = event;
  }

  /** Callback for all upload events. */
  async handleUpload() {
    let index = this.currentTab ? this.currentTab.index : 0;  // User always starts at first tab
    switch (index) {
      case 0:
        await this.handleFileUpload();
        break;

      case 1:
        await this.handleMagnetURLUpload();
        break;

      default:
        break;
    }
    this.uploadCompletionCallback();
  }

  /** Send request to server with all torrents uploaded. */
  async handleFileUpload(): Promise<void> {
    this.isLoading = true;

    try {
      let resp = await this.data_store.UploadTorrents(this.filesToUpload, this.filesDestination);
      this.snackbar.enqueueSnackBar("Uploaded torrent(s).", { type: 'success' });

    } catch (error) {
      console.error('unable to upload files', error);
      this.snackbar.enqueueSnackBar("Error uploding torrents, check console log for details.", { type: 'error' });
    }
  }

  /** Upload the link to a magnet URL */
  async handleMagnetURLUpload(): Promise<void> {
    let urls = this.urlsToUpload.trim();

    try {
      let res = await this.data_store.UploadTorrentsFromMagnetURLs(urls, this.filesDestination).toPromise();
      this.snackbar.enqueueSnackBar("Uploaded magnet URL(s).", { type: 'success' });

    } catch (error) {
      console.error('uploaded magnet URLs!', error);
      this.snackbar.enqueueSnackBar("Error uploding torrents, check console log for details.", { type: 'error' });
    }

  }

  async parse_uploaded_files() {
    let parsed_files = await this.torrentParser.ParseMultipleFiles(this.filesToUpload);
    this.serialized_nodes = await this.torrentParser.GetSerializedTorrentFromMultipleParsedFiles(parsed_files);

    this.isTreeExplorerReady = true;
  }

  /** Update which torrents the user wants to upload. */
  updateFiles(event: any, dragAndDrop?: boolean): void {
    this.isTreeExplorerReady = false;

    if(event.target.files.length === 0) { return; }

    // When using drag & drop, append instead of override
    if(dragAndDrop) {
      let existing = this.filesToUpload || []
      this.filesToUpload = [...existing, ...event.target.files]
    }
    else {
      this.filesToUpload = event.target.files;
    }

    this.parse_uploaded_files();
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
  public updateURLsToUpload(event: any) {
    this.urlsToUpload = event.target.value;
  }

  /** Handle cleanup for when adding torrents is completed
   * @param data Anything you want to send back to parent of this modal
   */
  private uploadCompletionCallback(): void {
    this.isLoading = false;
    this.dialogRef.close();
  }

  public getFilesToUploadString(): string {
    let len = this.filesToUpload ? this.filesToUpload.length : 0;
    let root = len === 1 ? `${len} file` : `${len} files`;

    return `${root} chosen`;
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
