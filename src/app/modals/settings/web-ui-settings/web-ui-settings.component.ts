import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { WebUISettings, WebUITorrentTableSettings, WebUINetworkSettings, WebUIUploadingSettings, WebUINotificationSettings, WebUIFileSystemSettings } from 'src/utils/Interfaces';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NetworkConnectionInformationService } from 'src/app/services/network/network-connection-information.service';
import { ApplicationDefaults } from 'src/app/services/app/defaults';

@Component({
  selector: 'app-web-ui-settings',
  templateUrl: './web-ui-settings.component.html',
  styleUrls: ['./web-ui-settings.component.scss']
})
export class WebUiSettingsComponent implements OnInit {
  theme_options: string[];

  default_refresh_interval = NetworkConnectionInformationService.DEFAULT_REFRESH_INTERVAL;

  // Column names have underscores as spaces
  default_sort_options = ApplicationConfigService.TORRENT_TABLE_COLUMNS.sort();
  all_torrent_table_columns = ApplicationConfigService.ALL_COLUMNS;

  /** Default settings */
  theme_settings = { theme: "" };
  torrent_data_options:     WebUINetworkSettings        = { refresh_interval: this.default_refresh_interval, auto_refresh: true }
  torrent_upload_settings:  WebUIUploadingSettings      = ApplicationDefaults.DEFAULT_WEB_UI_SETTINGS.upload_torrents;
  file_system_settings:     WebUIFileSystemSettings     = ApplicationDefaults.DEFAULT_WEB_UI_SETTINGS.file_system;
  torrent_table_settings:   WebUITorrentTableSettings   = ApplicationDefaults.DEFAULT_WEB_UI_SETTINGS.torrent_table;
  notification_settings:    WebUINotificationSettings   = ApplicationDefaults.DEFAULT_WEB_UI_SETTINGS.notifications;

  /** Validations */
  common_validators = [Validators.min(0)];
  form_controls = {
    default_items_per_page: new FormControl([...this.common_validators])
  }

  private web_ui_options: WebUISettings;

  constructor(private appConfig: ApplicationConfigService, private auth_service: AuthService) { this.theme_options = ApplicationConfigService.THEME_OPTIONS }

  ngOnInit(): void {
    this.web_ui_options = this.appConfig.getWebUISettings();
    this.theme_settings = {
      theme: this.web_ui_options.dark_mode_enabled ? 'Dark' : 'Light',
    }

    // Assign new values, if they exist
    // Using multiple splat operators lets us override default with what the user has already set
    this.torrent_table_settings   =  { ...this.torrent_table_settings,    ...this.web_ui_options?.torrent_table};
    this.file_system_settings     =  { ...this.file_system_settings,      ...this.web_ui_options?.file_system};
    this.torrent_data_options     =  { ...this.torrent_data_options,      ...this.web_ui_options?.network};
    this.torrent_upload_settings  =  { ... this.torrent_upload_settings,  ...this.web_ui_options?.upload_torrents};
    this.notification_settings    =  { ...this.notification_settings,     ...this.web_ui_options?.notifications};
  }

  /** Inspect this component via ViewChild to get
   * the user's preferences.
   */
  getSettings(): WebUISettings {
    return {
      dark_mode_enabled: this.theme_settings.theme === "Dark",
      torrent_table: this.torrent_table_settings,
      file_system: this.file_system_settings,
      network: {...this.torrent_data_options, auto_refresh: this.torrent_data_options.refresh_interval === this.default_refresh_interval},
      upload_torrents: this.torrent_upload_settings,
      notifications: this.notification_settings,
    }
  }

  _resetAllSettings() {
    if(confirm('Are you sure you want to RESET ALL WEB UI settings?')) {
      // Reset & refresh for changes to take affect
      this.appConfig.resetAllWebUISettings();
      window.location.reload();
    }
  }

  _disableAlternateWebUI() {
    if(confirm('Are you sure you wish to disable this Web UI?')) { this.auth_service.DisabledAlternateWebUI(); }
  }

}
