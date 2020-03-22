import { Injectable } from '@angular/core';
import { Torrent } from 'src/utils/Interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RowSelectionService {

  private _torrentsSelectedSource = new BehaviorSubject<Torrent[]>([]);
  private _torrentsSelectedValue = this._torrentsSelectedSource.asObservable();

  constructor() { }

  /** Update which torrents are selected. */
  public updateTorrentsSelected(newVal: Torrent[]): void {
    this._torrentsSelectedSource.next(newVal);
  }

  /** Get list of torrents selected as they get updated. */
  public getSearchValue(): Observable<Torrent[]> {
    return this._torrentsSelectedValue;
  }
}
