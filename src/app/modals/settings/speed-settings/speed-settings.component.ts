import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SpeedSettings } from 'src/utils/Interfaces';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';

@Component({
  selector: 'app-speed-settings',
  templateUrl: './speed-settings.component.html',
  styleUrls: ['./speed-settings.component.scss']
})
export class SpeedSettingsComponent implements OnInit {

  speed_settings: SpeedSettings = { up_limit: -1, dl_limit: -1 };

  common_validators = [Validators.required, Validators.min(-1)];
  validators = {
    up_limit: new FormControl(this.speed_settings.up_limit, [...this.common_validators]),
    dl_limit: new FormControl(this.speed_settings.dl_limit, [...this.common_validators])
  }

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

  invalidLimitMessage(): string {
    return 'Must be greater than or equal to -1';
  }

  /** Use ViewChild on this component
   * in order to grab this data.
   */
  getSettings(): SpeedSettings {
    return this.speed_settings;
  }

}
