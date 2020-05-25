import { Component, OnInit } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';

@Component({
  selector: 'app-about-settings',
  templateUrl: './about-settings.component.html',
  styleUrls: ['./about-settings.component.css']
})
export class AboutSettingsComponent implements OnInit {

  public qbit_mat_Ver: string;
  public appVer: string;
  public apiVer: string;

  constructor(private appConfig: ApplicationConfigService) {
    this.qbit_mat_Ver = this.appConfig.getApplicationVersionString();
  }

  async ngOnInit(): Promise<void> {
    let buildInfo = await this.appConfig.getQbittorrentBuildInfo();

    this.appVer = buildInfo.appVersion;
    this.apiVer = buildInfo.apiVersion;
  }

}
