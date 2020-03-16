import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { TorrentSearchServiceService } from 'src/app/services/torrent-search-service.service';

@Component({
  selector: 'app-search-torrents',
  templateUrl: './search-torrents.component.html',
  styleUrls: ['./search-torrents.component.css']
})
export class SearchTorrentsComponent implements OnInit {

  public searchValue: string;

  constructor(private searchService: TorrentSearchServiceService) { }

  ngOnInit(): void {
  }

  /** Callback for when user changes search query */
  public onSearchValueChange(event: any): void {
    this.searchValue = event.target.value;
    this.searchService.updateSearch(this.searchValue);
  }

}
