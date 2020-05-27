import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';
import { WebUiSettingsComponent } from './web-ui-settings/web-ui-settings.component';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  @ViewChild(WebUiSettingsComponent) webUISettings: WebUiSettingsComponent;

  public tab_selected = "web_ui"                  // Keep track of what section the user is in
  public isDarkTheme: Observable<boolean>;

  constructor(private theme: ThemeService, private appConfig: ApplicationConfigService) { this.isDarkTheme = this.theme.getThemeSubscription(); }

  ngOnInit(): void {
  }

  isCurrentlyDarkTheme(): boolean {
    return this.theme.getCurrentValue();
  }

  getClassForTab(tab_selected: string) {
    return this.tab_selected === tab_selected ? (this.isCurrentlyDarkTheme() ? 'active_dark' : 'active_light') : ''
  }

  /** Callback for when user clicks on a tab in the left-navigation */
  onTabSelect(tab: string): void {
    this.tab_selected = tab;
  }

  onSave() {
    let web_ui_settings = this.webUISettings.getSettings();
    this.appConfig.setWebUIOptions(web_ui_settings);

    window.location.reload();
  }

}
