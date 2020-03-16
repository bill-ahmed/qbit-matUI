import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TorrentSearchServiceService {

  private _searchSource = new BehaviorSubject<string>("");
  private _searchValue = this._searchSource.asObservable();

  constructor() { }

  public updateSearch(newVal: string): void {
    this._searchSource.next(newVal);
  }

  /** Get search value as it's updated */
  public getSearchValue(): Observable<string> {
    return this._searchValue;
  }
}
