import { Injectable } from '@angular/core';
import * as _appConfig from '../../app.config.json';
import { QbittorrentBuildInfo, UserPreferences } from 'src/utils/Interfaces';
import { TorrentDataStoreService } from '../torrent-management/torrent-data-store.service';

// Utils
import * as http_endpoints from '../../../assets/http_config.json';
import { IsDevEnv } from 'src/utils/Environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationConfigService {

  private application_version: string;
  private user_preferences: UserPreferences;
  private qBitBuildInfo: QbittorrentBuildInfo;

  constructor(private data_store: TorrentDataStoreService, private http: HttpClient) {

    this.application_version = _appConfig.version;
    this.data_store.GetApplicationBuildInfo()
    .then(res => { this.qBitBuildInfo = res })
    .catch(err => { console.log("Error getting build info", err); this.qBitBuildInfo = { appVersion: 'N/A', apiVersion: 'N/A' } });

    this.getUserPreferences();
  }

  /** If dark theme is enabled, then disable it in preferences. */
  setDarkThemeEnabled(val: boolean) {
    this.user_preferences.web_ui_options.dark_mode_enabled = val;
    localStorage.setItem('web_ui_options', JSON.stringify(this.user_preferences.web_ui_options)); /** Info on dark theme is not stored in qBittorrent */
  }

  async getQbittorrentBuildInfo(): Promise<QbittorrentBuildInfo> {
    if(!this.qBitBuildInfo) { this.qBitBuildInfo = await this.data_store.GetApplicationBuildInfo(); }

    return this.qBitBuildInfo;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    if(!this.user_preferences) { await this.updateUserPreferences(); }

    return this.user_preferences;
  }

  getApplicationVersion(): string {
    return this.application_version;
  }

  /** A string in the format 'v1.2.3' */
  getApplicationVersionString(): string {
    return `v${this.getApplicationVersion()}`;
  }

  async getDarkThemePref(): Promise<boolean> {
    if(!this.user_preferences) {
      await this.getUserPreferences();
    }
    console.log('got user pref', this.user_preferences)
    return this.user_preferences.web_ui_options.dark_mode_enabled;
  }

  private async updateUserPreferences() {
    let root = http_endpoints.endpoints.root;
    let endpoint = http_endpoints.endpoints.userPreferences;
    let url = root + endpoint;

    // Do not send cookies in dev mode
    let options = IsDevEnv() ? { } : { withCredentials: true }

    this.user_preferences = await this.http.get(url, options).toPromise() as UserPreferences;
    this.user_preferences.web_ui_options = JSON.parse(localStorage.getItem("web_ui_options")) || { };
  }
}
