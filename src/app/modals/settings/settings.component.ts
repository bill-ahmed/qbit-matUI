import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public tab_selected = "web_ui"                  // Keep track of what section the user is in
  public isDarkTheme: Observable<boolean>;

  constructor(private theme: ThemeService) { this.isDarkTheme = this.theme.getThemeSubscription(); }

  ngOnInit(): void {
  }

  /** Callback for when user clicks on a tab in the left-navigation */
  onTabSelect(tab: string): void {
    this.tab_selected = tab;
  }

}
