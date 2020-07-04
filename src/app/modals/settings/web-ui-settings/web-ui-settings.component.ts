import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { WebUISettings, WebUITorrentTableSettings, WebUINetworkSettings, WebUIUploadingSettings, WebUINotificationSettings, WebUIFileSystemSettings } from 'src/utils/Interfaces';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-web-ui-settings',
  templateUrl: './web-ui-settings.component.html',
  styleUrls: ['./web-ui-settings.component.scss']
})
export class WebUiSettingsComponent implements OnInit {

  theme_options: string[];

  /** Default settings */
  theme_settings = { theme: "" };
  torrent_table_settings:   WebUITorrentTableSettings   = {
    paginate: false, default_items_per_page: 10,
    showFirstAndLastOptions: false,
    default_sort_order: {
      column_name: 'Completed On',
      order: 'desc'
    }
  }
  torrent_data_options:     WebUINetworkSettings        = { refresh_interval: -1, auto_refresh: false }
  torrent_upload_settings:  WebUIUploadingSettings      = { show_parsed_torrents_from_file: true, show_parsed_torrents_from_magnet: true }
  file_system_settings:     WebUIFileSystemSettings     = { use_alt_delimiter: false, delimiter: '/' };
  notification_settings:    WebUINotificationSettings   = { show_snack_notifications: false }

  /** Validations */
  common_validators = [Validators.min(0)];
  form_controls = {
    default_items_per_page: new FormControl(this.torrent_table_settings.default_items_per_page, [...this.common_validators])
  }

  private web_ui_options: WebUISettings;

  constructor(private appConfig: ApplicationConfigService, private auth_service: AuthService) { this.theme_options = ApplicationConfigService.THEME_OPTIONS }

  ngOnInit(): void {
    this.web_ui_options = this.appConfig.getWebUISettings();
    this.theme_settings = {
      theme: this.web_ui_options.dark_mode_enabled ? 'Dark' : 'Light',
    }

    // Assign new values, if they exist
    this.torrent_table_settings = this.web_ui_options.torrent_table || this.torrent_table_settings;
    this.file_system_settings = this.web_ui_options?.file_system || this.file_system_settings;
    this.torrent_data_options = this.web_ui_options?.network || this.torrent_data_options;
    this.torrent_upload_settings = this.web_ui_options?.upload_torrents || this.torrent_upload_settings;
    this.notification_settings = this.web_ui_options?.notifications || this.notification_settings;
  }

  /** Inspect this component via ViewChild to get
   * the user's preferences.
   */
  getSettings(): WebUISettings {
    return {
      dark_mode_enabled: this.theme_settings.theme === "Dark",
      torrent_table: this.torrent_table_settings,
      file_system: this.file_system_settings,
      network: this.torrent_data_options,
      upload_torrents: this.torrent_upload_settings,
      notifications: this.notification_settings,
    }
  }

  _disableAlternateWebUI() {
    if(confirm('Are you sure you wish to disable this Web UI?')) { this.auth_service.DisabledAlternateWebUI(); }
  }

}
