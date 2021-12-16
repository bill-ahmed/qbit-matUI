import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TorrentFilterService {
  private _filterSource = new BehaviorSubject<TorrentFilter>({ type: '', value: '' });
  private _filterValue = this._filterSource.asObservable();

  constructor() { }

  public updateFilter(newVal: TorrentFilter): void {
    this._filterSource.next(newVal);
  }

  /** Get filter value as it's updated */
  public getFilterValue(): Observable<TorrentFilter> {
    return this._filterValue;
  }
}

export type TorrentFilter = {
  /** What is being filtered. */
  type: '' | 'filter_status' | 'filter_tracker',

  /** The value to filter by */
  value: string
}
