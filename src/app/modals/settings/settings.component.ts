import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public isDarkTheme: Observable<boolean>;

  constructor(private theme: ThemeService) { this.isDarkTheme = this.theme.getThemeSubscription(); }

  ngOnInit(): void {
  }

}
