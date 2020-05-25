import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationConfigService } from './app/application-config.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private is_dark_theme_source = new BehaviorSubject<boolean>(false);
  private is_dark_theme = this.is_dark_theme_source.asObservable();

  constructor(private appConfig: ApplicationConfigService) { this.is_dark_theme_source.next(this.appConfig.getDarkThemePref()) }

  public setDarkTheme(val: boolean): void {
    this.is_dark_theme_source.next(val);
    this.appConfig.setDarkThemeEnabled(val);
  }

  public getThemeSubscription(): Observable<boolean> {
    return this.is_dark_theme;
  }

  public getCurrentValue(): boolean {
    return this.is_dark_theme_source.value;
  }
}
