import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SpeedSettings } from 'src/utils/Interfaces';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { UnitsHelperService } from 'src/app/services/units-helper.service';

@Component({
  selector: 'app-speed-settings',
  templateUrl: './speed-settings.component.html',
  styleUrls: ['./speed-settings.component.scss']
})
export class SpeedSettingsComponent implements OnInit {

  speed_settings: SpeedSettings = {
    up_limit: -1,
    dl_limit: -1,

    alt_dl_limit: -1,
    alt_up_limit: -1,

    scheduler_enabled: false,
    schedule_from_hour: 0,
    schedule_from_min: 0,
    schedule_to_hour: 0,
    schedule_to_min: 0,
    scheduler_days: 0
  };

  /**
   * The index of each element is IMPORTANT! We send over the index
   * rather than the string itself when updating preferences.
   */
  scheduler_days_ordering = [
    'Every Day',
    'Weekdays',
    'Weekends',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  scheduler_day_chosen: string = this.scheduler_days_ordering[0];

  common_validators = [Validators.required, Validators.min(-1)];
  validators = {
    up_limit: new FormControl(this.speed_settings.up_limit, [...this.common_validators]),
    dl_limit: new FormControl(this.speed_settings.dl_limit, [...this.common_validators]),
    alt_dl_limit: new FormControl(this.speed_settings.dl_limit, [...this.common_validators]),
    alt_up_limit: new FormControl(this.speed_settings.dl_limit, [...this.common_validators])
  }

  constructor(private appConfig: ApplicationConfigService, private units: UnitsHelperService) {
    this.appConfig.getUserPreferences()
    .then(pref => {
      let { up_limit, dl_limit, alt_dl_limit, alt_up_limit, scheduler_enabled, schedule_from_hour, schedule_from_min, schedule_to_hour, schedule_to_min, scheduler_days } = pref;

      this.speed_settings = {
        up_limit,
        dl_limit,

        alt_dl_limit,
        alt_up_limit,

        scheduler_enabled,
        schedule_from_hour,
        schedule_from_min,
        schedule_to_hour,
        schedule_to_min,
        scheduler_days
      };

      this.scheduler_day_chosen = this.scheduler_days_ordering[scheduler_days];
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
    return {
      ...this.speed_settings,
      up_limit: this.units.Kibibits_to_bits(this.speed_settings.up_limit),
      dl_limit: this.units.Kibibits_to_bits(this.speed_settings.dl_limit),

      scheduler_days: this.scheduler_days_ordering.indexOf(this.scheduler_day_chosen)
    };
  }

}
