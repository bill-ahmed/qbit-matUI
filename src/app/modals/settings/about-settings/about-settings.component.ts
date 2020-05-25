import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';

@Component({
  selector: 'app-about-settings',
  templateUrl: './about-settings.component.html',
  styleUrls: ['./about-settings.component.css']
})
export class AboutSettingsComponent implements OnInit {

  public appVer: string;

  constructor(private appConfig: ApplicationConfigService) {
    this.appVer = this.appConfig.getApplicationVersionString();
  }

  ngOnInit(): void {
  }

}
