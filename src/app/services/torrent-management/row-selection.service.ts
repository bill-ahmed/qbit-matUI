import { Injectable } from '@angular/core';
import { Torrent } from 'src/utils/Interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RowSelectionService {

  private _torrentsSelectedSource = new BehaviorSubject<string[]>([]);
  private _torrentsSelectedValue = this._torrentsSelectedSource.asObservable();

  constructor() { }

  /** Update which torrents are selected. */
  public updateTorrentsSelected(newVal: string[]): void {
    this._torrentsSelectedSource.next(newVal);
  }

  /** Get list of torrents selected as they get updated. */
  public getTorrentsSelected(): Observable<string[]> {
    return this._torrentsSelectedValue;
  }

  /** Get current value of list of torrents selected
   * @returns List of IDs of torrents selected
   */
  public getTorrentsSelectedValue(): string[] {
    return this._torrentsSelectedSource.value
  }

  /** Clear list of selected torrents */
  public clearSelection(): void {
    this.updateTorrentsSelected([]);
  }
}
