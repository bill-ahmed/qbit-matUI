import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-search-torrents',
  templateUrl: './search-torrents.component.html',
  styleUrls: ['./search-torrents.component.css']
})
export class SearchTorrentsComponent implements OnInit {

  public searchValue: string;

  constructor() { }

  ngOnInit(): void {
  }

  /** Callback for when user changes search query */
  public onSearchValueChange(event: any): void {
    this.searchValue = event.target.value;
    console.log("Searching for: ", this.searchValue);
  }

}
