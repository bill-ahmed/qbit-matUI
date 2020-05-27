import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// UI Components
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddTorrentDialogComponent } from '../modals/add-torrent-dialog/add-torrent-dialog.component';

// Utils
import * as http_endpoints from '../../assets/http_config.json';
import { HttpClient } from '@angular/common/http';
import { IsDevEnv } from '../../utils/Environment';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';
import { QbittorrentBuildInfo } from 'src/utils/Interfaces';
import { AuthService } from '../services/auth/auth.service';
import { SettingsComponent } from '../modals/settings/settings.component';
import { ApplicationConfigService } from '../services/app/application-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private cookieSID: string;
  private http_endpoints: any;
  public applicationBuildInfo: QbittorrentBuildInfo;
  public isDarkTheme: Observable<boolean>;

  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog, private theme: ThemeService, private auth: AuthService,
              private appConfig: ApplicationConfigService) {
    this.http_endpoints = http_endpoints
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
        minWidth: "50%",
        minHeight: "50%",
        autoFocus: false
      }
    );

    settingsDialogRef.afterClosed().subscribe(res => {
      console.log("Closed settings modal:", res);
    })
  }

  /** Callback for when user is finished uploading a torrent */
  handleAddTorrentDialogClosed(data: any): void {
    console.log('Dialog closed:', data);
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
