import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'qbit-WebUI';
  public isDarkTheme: Observable<boolean>;

  constructor(private theme: ThemeService) { }

  ngOnInit() { this.isDarkTheme = this.theme.getThemeSubscription(); }
}
