import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private is_dark_theme_source = new BehaviorSubject<boolean>(false);
  private is_dark_theme = this.is_dark_theme_source.asObservable();

  constructor() {
    let web_ui_pref = JSON.parse(localStorage.getItem('web_ui_options'))
    this.setDarkTheme(!!web_ui_pref?.dark_mode_enabled)
  }

  public setDarkTheme(val: boolean): void {
    this.is_dark_theme_source.next(val);
    let web_ui_pref = JSON.parse(localStorage.getItem('web_ui_options')) || { }
    web_ui_pref.dark_mode_enabled = val;

    localStorage.setItem('web_ui_options', JSON.stringify(web_ui_pref))

    // If dark theme, set body background appropriately
    document.body.style.backgroundColor = val ? '#303030' : 'white'
  }

  public getThemeSubscription(): Observable<boolean> {
    return this.is_dark_theme;
  }

  /** True iff dark theme enabled, false otherwise */
  public getCurrentValue(): boolean {
    return this.is_dark_theme_source.value;
  }
}
