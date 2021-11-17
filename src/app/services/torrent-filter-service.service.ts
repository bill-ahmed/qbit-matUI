import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TorrentFilterService {
  private _filterSource = new BehaviorSubject<string>("");
  private _filterValue = this._filterSource.asObservable();

  constructor() { }

  public updateFilter(newVal: string): void {
    this._filterSource.next(newVal);
  }

  /** Get filter value as it's updated */
  public getFilterValue(): Observable<string> {
    return this._filterValue;
  }
}
