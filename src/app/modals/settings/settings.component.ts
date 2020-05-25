import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  public tab_selected = "web_ui"                  // Keep track of what section the user is in
  public isDarkTheme: Observable<boolean>;

  constructor(private theme: ThemeService) { this.isDarkTheme = this.theme.getThemeSubscription(); }

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

}
