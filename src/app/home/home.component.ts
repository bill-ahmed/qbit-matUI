import { Component, OnInit } from '@angular/core';

// UI Components
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddTorrentDialogComponent } from '../modals/add-torrent-dialog/add-torrent-dialog.component';

// Utils
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';
import { QbittorrentBuildInfo } from 'src/utils/Interfaces';
import { AuthService } from '../services/auth/auth.service';
import { SettingsComponent } from '../modals/settings/settings.component';
import { ApplicationConfigService } from '../services/app/application-config.service';
import { TorrentDataStoreService } from '../services/torrent-management/torrent-data-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private cookieSID: string;
  public applicationBuildInfo: QbittorrentBuildInfo;
  public isDarkTheme: Observable<boolean>;

  constructor(private data_store: TorrentDataStoreService, public dialog: MatDialog, private theme: ThemeService, private auth: AuthService,
              private appConfig: ApplicationConfigService) {
   }

  ngOnInit(): void {

    if(this.cookieSID === ""){
      this.logout();
    }

    // Get user preferences
    this.getUserPreferences();
    this.isDarkTheme = this.theme.getThemeSubscription();
    this.getQbitBuildInfo();
  }

  /** Open the modal for adding a new torrent */
  openAddTorrentDialog(): void {
    const addTorDialogRef = this.dialog.open(AddTorrentDialogComponent, {disableClose: true, panelClass: "generic-dialog"});

    addTorDialogRef.afterClosed().subscribe((result: any) => {
      this.handleAddTorrentDialogClosed(result);
    });
  }

  openSettingsDialog():void {
    const settingsDialogRef = this.dialog.open(
      SettingsComponent,
      {
        panelClass: "generic-dialog",
        minWidth: "80%",
        height: "85vh",
        autoFocus: false,
        disableClose: true
      }
    );

    settingsDialogRef.afterClosed().subscribe(res => {
    })
  }

  /** Callback for when user is finished uploading a torrent */
  handleAddTorrentDialogClosed(data: any): void {
  }

  public toggleTheme(): void {
    this.theme.setDarkTheme(!this.theme.getCurrentValue());
  }

  handleSlideToggle(): void {
    this.toggleTheme();
  }

  isDarkThemeEnabled(): boolean {
    return this.theme.getCurrentValue();
  }

  getAppVersion(): string {
    return this.applicationBuildInfo ? this.applicationBuildInfo.appVersion : "N/A";
  }

  getAPIVersion(): string {
    return this.applicationBuildInfo ? this.applicationBuildInfo.apiVersion : "N/A";
  }

  private async getQbitBuildInfo() {
    this.applicationBuildInfo = await this.appConfig.getQbittorrentBuildInfo();
  }

  private async getUserPreferences(): Promise<void> {
    let pref = await this.appConfig.getUserPreferences();

    if(pref.web_ui_options.dark_mode_enabled) {
      this.theme.setDarkTheme(true);
    }
  }

  logout(): void {
    this.auth.Logout();
  }

}
