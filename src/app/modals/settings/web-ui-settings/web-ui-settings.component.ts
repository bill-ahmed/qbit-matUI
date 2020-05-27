import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { WebUISettings } from 'src/utils/Interfaces';

@Component({
  selector: 'app-web-ui-settings',
  templateUrl: './web-ui-settings.component.html',
  styleUrls: ['./web-ui-settings.component.scss']
})
export class WebUiSettingsComponent implements OnInit {

  theme_options: string[];

  /** Default settings */
  theme_settings = { theme: "" };
  torrent_table_settings = { paginate: false, default_items_per_page: 10, showFirstAndLastOptions: false }
  file_system_settings = { use_alt_delimiter: false, delimiter: '/' };

  private web_ui_options: WebUISettings;

  constructor(private appConfig: ApplicationConfigService) { this.theme_options = ApplicationConfigService.THEME_OPTIONS }

  ngOnInit(): void {
    this.web_ui_options = this.appConfig.getWebUISettings();
    this.theme_settings = {
      theme: this.web_ui_options.dark_mode_enabled ? 'Dark' : 'Light',
    }

    this.torrent_table_settings = {
      paginate: this.web_ui_options.torrent_table?.paginate || false,
      default_items_per_page: this.web_ui_options.torrent_table?.default_items_per_page || 10,
      showFirstAndLastOptions: this.web_ui_options.torrent_table?.showFirstAndLastOptions || false
    }

    this.file_system_settings = {
      use_alt_delimiter: !!this.web_ui_options.file_system?.delimiter,
      delimiter: this.web_ui_options.file_system?.delimiter ? this.web_ui_options.file_system.delimiter : '/'
    }
  }

  /** Inspect this component via ViewChild to get
   * the user's preferences.
   */
  getSettings(): WebUISettings {
    return {
      dark_mode_enabled: this.theme_settings.theme === "Dark",
      torrent_table: {
        ...this.torrent_table_settings
      },
      file_system: {
        delimiter: this.file_system_settings.use_alt_delimiter ? this.file_system_settings.delimiter : null
      }
    }
  }

}
