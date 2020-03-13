import { Component, OnInit, isDevMode } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { MainData, Torrent } from '../../utils/Interfaces';


// UI Components
import { MatTableDataSource, MatTable } from '@angular/material/table';

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
  private DEFAULT_REFRESH_TIMEOUT = 1000
  private REFRESH_INTERVAL: any = null;

  constructor(private cookieService: CookieService, private http: HttpClient) { 
    this.http_endpoints = http_endpoints
  }

  ngOnInit(): void {
    let cookieInfo = GetCookieInfo()
    this.cookieValueSID = this.cookieService.get(cookieInfo.SIDKey);

    // Retrieve updated torrent data on interval
    this.allTorrentData = null;
    //this.SetTorrentRefreshInterval(this.DEFAULT_REFRESH_TIMEOUT)
  }

  ngOnDestroy(): void {
    this.ClearTorrentRefreshInterval();
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
      let cleanTorrentData: [Torrent];
      
      for(const key of Object.keys(data.torrents)){
        data.torrents[key].hash = key;

        if(cleanTorrentData){
          cleanTorrentData.push(data.torrents[key]);
        } else {
          cleanTorrentData = [data.torrents[key]];
        }
        
      }

      // Update state with data retrieved
      this.allTorrentInformation = data;
      this.allTorrentData = cleanTorrentData;
      this.updateDataSource();

    });
  }

  /**Update material table with new data */
  updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);
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

}
