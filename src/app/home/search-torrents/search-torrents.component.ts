import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { TorrentSearchServiceService } from 'src/app/services/torrent-search-service.service';
import { TorrentDataStoreService } from 'src/app/services/torrent-management/torrent-data-store.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Torrent } from 'src/utils/Interfaces';
import { FormControl } from '@angular/forms';
import { GetTorrentSearchName } from 'src/utils/Helpers';

@Component({
  selector: 'app-search-torrents',
  templateUrl: './search-torrents.component.html',
  styleUrls: ['./search-torrents.component.css']
})
export class SearchTorrentsComponent implements OnInit {

  public searchValue: string;

  // Needed for auto-complete logic
  public filteredOptions: Observable<string[]>;
  public myControl = new FormControl();
  private options: string[] = [];

  constructor(private searchService: TorrentSearchServiceService, private data_store: TorrentDataStoreService) { }

  ngOnInit(): void {

    // Detect any changes to torrrent data & update options accordingly
    this.data_store.GetTorrentDataSubscription().subscribe(res => {

      if(res) { this._updateOptions(res.torrents); }
    });

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(val => this._filter(val))
    )
  }

  /** Callback for when user changes search query */
  public onSearchValueChange(event: any): void {
    this.searchValue = event.target.value;
    this.searchService.updateSearch(this.searchValue);
  }

  /** Helper to update names of torrents in state */
  private async _updateOptions(tor: Torrent[]): Promise<void> {
    this.options = tor.map(elem => elem.name);
  }

  private _filter(val: string): string[] {
    let filterValue = GetTorrentSearchName(val);
    return this.options.filter(option => GetTorrentSearchName(option).includes(filterValue));
  }

}
