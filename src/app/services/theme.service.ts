import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private is_dark_theme_source = new BehaviorSubject<boolean>(false);
  private is_dark_theme = this.is_dark_theme_source.asObservable();

  constructor() { }

  public setDarkTheme(val: boolean): void {
    this.is_dark_theme_source.next(val);
  }

  public getThemeSubscription(): Observable<boolean> {
    return this.is_dark_theme;
  }

  public getCurrentValue(): boolean {
    return this.is_dark_theme_source.value;
  }
}
