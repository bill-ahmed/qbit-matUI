import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { MainData, Torrent } from '../../utils/Interfaces';
import { IsDevEnv } from '../../utils/Environment';


// UI Components
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';

import * as http_endpoints from '../../assets/http_config.json';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentInformation: MainData;
  public allTorrentData : [Torrent];
  public cookieValueSID: string;
  private http_endpoints: any;

  // UI Components
  public tableColumns: string[] = ["Name", "Size", "Progress", "Status", "Down Speed", "Up Speed", "ETA", "Completed On"];
  public dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);

  // Other
  private DEFAULT_REFRESH_TIMEOUT = 2000
  private REFRESH_INTERVAL: any = null;
  private isFetchingData: boolean = false;
  private RID = 0;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private cookieService: CookieService, private http: HttpClient) { 
    this.http_endpoints = http_endpoints
  }

  ngOnInit(): void {
    let cookieInfo = GetCookieInfo()
    this.cookieValueSID = this.cookieService.get(cookieInfo.SIDKey);

    this.dataSource.sort = this.sort;

    // Retrieve updated torrent data on interval
    this.allTorrentData = null;
    this.SetTorrentRefreshInterval(this.DEFAULT_REFRESH_TIMEOUT)
  }

  ngOnDestroy(): void {
    this.ClearTorrentRefreshInterval();
  }

  setCookie(): void{
    this.cookieValueSID = "NEW VALUE";
  }

  /**Get all torrent data */
  getTorrentData(): void{
    
    // Don't request if we're already in the middle of one
    if(this.isFetchingData){
      return;
    }

    this.isFetchingData = true;

    let root = this.http_endpoints.default.endpoints.root;
    let endpoint = this.http_endpoints.default.endpoints.torrentList;
    let url = root + endpoint + `?rid=${this.RID}`;
    console.log(url)

    // Do not send cookies in dev mode
    let options = IsDevEnv() ? { } : { withCredentials: true }
   
    this.http.get<MainData>(url, options)
    .subscribe((data: MainData) => 
    {
      let cleanTorrentData: [Torrent];
      
      for(const key of Object.keys(data.torrents)){
        data.torrents[key].hash = key;

        if(cleanTorrentData){
          cleanTorrentData.push(data.torrents[key]);
        } else {
          cleanTorrentData = [data.torrents[key]];
        }
        
      }
      console.log(data);

      // Update state with data retrieved
      this.allTorrentInformation = data;
      this.allTorrentData = cleanTorrentData;
      this.updateDataSource();

      this.isFetchingData = false;
      this.RID += 1;

    });
  }

  /**Update material table with new data */
  updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);
    this.dataSource.sort = this.sort;
  }

  /**Set interval for getting torrents
   * @param interval The interval to set.
   */
  SetTorrentRefreshInterval(interval: number): void {
    let newInterval = interval || this.DEFAULT_REFRESH_TIMEOUT;
    this.REFRESH_INTERVAL = setInterval(() => this.getTorrentData(), newInterval);
    
  }

  /** Clear interval for getting new torrent data */
  ClearTorrentRefreshInterval(): void {
    if (this.REFRESH_INTERVAL) { clearInterval(this.REFRESH_INTERVAL); }
  }

  /** Determine if table is loading data or not */
  isLoading(): boolean {
    return this.allTorrentData == null
  }

}
