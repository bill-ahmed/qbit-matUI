import { Component, OnInit, isDevMode } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { MainData } from '../../utils/Interfaces';

// UI Components
import { MatTableDataSource, MatTable } from '@angular/material/table';

import * as http_endpoints from '../../assets/http_config.json';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentData : MainData;
  public cookieValueSID: string;
  private http_endpoints: any;

  // UI Components
  displayedColumns: string[] = ["col1", "col2", "col3"];
  dataSource = new MatTableDataSource([
    {
      col1: "1", col2: "2", col3: "3"
    },
    {
      col1: "4", col2: "5", col3: "6"
    },
  ]);

  constructor(private cookieService: CookieService, private http: HttpClient) { 
    this.http_endpoints = http_endpoints
  }

  ngOnInit(): void {
    let cookieInfo = GetCookieInfo()
    this.cookieValueSID = this.cookieService.get(cookieInfo.SIDKey);
    this.getTorrentData();
  }

  setCookie(): void{
    this.cookieValueSID = "NEW VALUE";
  }

  /**Get all torrent data */
  getTorrentData(): void{
    let root = this.http_endpoints.default.endpoints.root;
    let endpoint = this.http_endpoints.default.endpoints.torrentList;
    let url = root + endpoint
    console.log(url)

    // Do not send cookies in dev mode
    let options = isDevMode() ? { } : { withCredentials: true }
   
    this.http.get<MainData>(url, options)
    .subscribe((data: MainData) => 
    {
      console.log(data);

    });
  }

}
