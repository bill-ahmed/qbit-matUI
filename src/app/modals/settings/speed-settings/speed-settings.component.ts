import { Component, OnInit } from '@angular/core';
import { SpeedSettings } from 'src/utils/Interfaces';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';

@Component({
  selector: 'app-speed-settings',
  templateUrl: './speed-settings.component.html',
  styleUrls: ['./speed-settings.component.scss']
})
export class SpeedSettingsComponent implements OnInit {

  speed_settings: SpeedSettings = { up_limit: -1, dl_limit: -1 };

  constructor(private appConfig: ApplicationConfigService) {
    this.appConfig.getUserPreferences()
    .then(pref => {
      this.speed_settings = {
        up_limit: pref.up_limit,
        dl_limit: pref.dl_limit
      }
    })
  }

  ngOnInit(): void {
  }

  /** Use ViewChild on this component
   * in order to grab this data.
   */
  getSettings(): SpeedSettings {
    return this.speed_settings;
  }

}
