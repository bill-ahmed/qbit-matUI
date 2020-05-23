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
import { TorrentDataStoreService } from '../services/torrent-management/torrent-data-store.service';
import { ApplicationBuildInfo } from 'src/utils/Interfaces';
import { AuthService } from '../services/auth/auth.service';
import { SettingsComponent } from '../modals/settings/settings.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private cookieSID: string;
  private http_endpoints: any;
  public applicationBuildInfo: ApplicationBuildInfo;
  public isDarkTheme: Observable<boolean>;

  constructor(private router: Router, private http: HttpClient, public dialog: MatDialog, private theme: ThemeService,
              private data_store: TorrentDataStoreService, private auth: AuthService) {
    this.http_endpoints = http_endpoints
   }

  ngOnInit(): void {

    if(this.cookieSID === ""){
      this.logout();
    }

    // Get user preferences
    this.getUserPreferences();
    this.isDarkTheme = this.theme.getThemeSubscription();

    this.data_store.GetApplicationBuildInfo()
    .then(res => { this.applicationBuildInfo = res; })
    .catch(err => { console.log(err); this.applicationBuildInfo = { appVersion: "N/A", apiVersion: "N/A" } });
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
        disableClose: true,
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
    localStorage.setItem("dark-mode-enabled", `${this.theme.getCurrentValue()}`)
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

  private async getUserPreferences(): Promise<void> {

    let root = this.http_endpoints.default.endpoints.root;
    let endpoint = this.http_endpoints.default.endpoints.userPreferences;
    let url = root + endpoint;

    // Do not send cookies in dev mode
    let options = IsDevEnv() ? { } : { withCredentials: true }

    this.http.get(url, options)
    .subscribe((data: any) =>
    {
      this.persistUserPreferences(data);
    });

    let shouldDarkModeBeEnabled = localStorage.getItem("dark-mode-enabled") === "true";
    if(shouldDarkModeBeEnabled) {
      this.theme.setDarkTheme(true);
    }
  }

  /** Store user preferences in local storage */
  private persistUserPreferences(data: any): void {
    localStorage.setItem("preferences", JSON.stringify(data));
  }

  logout(): void {
    this.auth.Logout();
  }

}
