import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { MainData, Torrent, GlobalTransferInfo } from '../../utils/Interfaces';
import { IsDevEnv } from '../../utils/Environment';


// UI Components
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ProgressBarMode } from '@angular/material/progress-bar';

// Helpers
import * as http_endpoints from '../../assets/http_config.json';
import { GetFileSizeString } from '../../utils/DataRepresentation';

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
  public tableColumns: string[] = ["Name", "Size", "Progress", "Status", "Down_Speed", "Up_Speed", "ETA", "Completed_On"];
  public dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);

  // Other
  private DEFAULT_REFRESH_TIMEOUT = 2000
  private REFRESH_INTERVAL: any = null;
  private isFetchingData: boolean = false;
  private RID = 0;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // Helper functions
  GetFileSizeString: any;

  constructor(private cookieService: CookieService, private http: HttpClient) { 
    this.http_endpoints = http_endpoints
    this.GetFileSizeString = GetFileSizeString;
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
  private getTorrentData(): void{
    
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
      this.updateDataSource(data);
    });
  }

  /**Update material table with new data */
  private async updateDataSource(data: MainData): Promise<void> {
    
    let cleanData = this.getFormattedResponse(data);
    console.log(cleanData);

    // Update state with data retrieved
    this.allTorrentInformation = cleanData;
    this.allTorrentData = cleanData.torrents;

    this.isFetchingData = false;
    
    /** 
     * Incrementing RID will give us changes between last /sync/main request. 
     * Move getTorrentData() into separate service in order to handle changelogs
    */
    //this.RID += 1;

    this.dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);
    this.dataSource.sort = this.sort;
  }


  /** Clean the response given from server */
  private getFormattedResponse(data: MainData): MainData {

    let cleanTorrentData: [Torrent];

    // (1) If we already have some data, update it
    // if(this.allTorrentInformation) {
    //   this.updateServerStatus(data.server_state);
    //   this.updateTorrentChanges(data.torrents);

    //   return this.allTorrentInformation;
    // }

    // Re-format response
    for(const key of Object.keys(data.torrents)){
      data.torrents[key].hash = key;

      if(cleanTorrentData){
        cleanTorrentData.push(data.torrents[key]);
      } else {
        cleanTorrentData = [data.torrents[key]];
      }
      
    }

    data.torrents = cleanTorrentData;
    return data;
  }

  /** Update server status in changelog */
  private updateServerStatus(data: GlobalTransferInfo): void {
    for(const key of Object.keys(data)){
      this.allTorrentInformation.server_state[key] = data[key];
    }
  }

  private updateTorrentChanges(data: any) {
    for(const key of Object.keys(data)){
      let torID = key;

      for(const torKey of Object.keys(data[torID])){

        //TODO: allTorrentInformation.torrents is Array, while data still holds torrents as objects
        this.allTorrentInformation.torrents[torKey] = data[key][torID]; 
      }
    }
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
