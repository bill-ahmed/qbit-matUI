import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { DownloadSettings } from 'src/utils/Interfaces';

@Component({
  selector: 'app-download-settings',
  templateUrl: './download-settings.component.html',
  styleUrls: ['./download-settings.component.scss']
})
export class DownloadSettingsComponent implements OnInit {

  downloadSettings: DownloadSettings = { max_active_downloads: 0, max_active_torrents: 0, max_active_uploads: 0, save_path: "", scan_dirs: [], temp_path: "" };

  constructor(private appConfig: ApplicationConfigService) {
    this.appConfig.getUserPreferences()
    .then(pref => {
      this.downloadSettings = {
        max_active_downloads: pref.max_active_downloads,
        max_active_torrents: pref.max_active_torrents,
        max_active_uploads: pref.max_active_uploads,
        save_path: pref.save_path,
        scan_dirs: pref.scan_dirs,
        temp_path: pref.temp_path
      }
    });
  }

  ngOnInit(): void { }

  /** Use ViewChild on this component
   * in order to grab this data.
   */
  getSettings(): DownloadSettings {
    return this.downloadSettings;
  }


}
