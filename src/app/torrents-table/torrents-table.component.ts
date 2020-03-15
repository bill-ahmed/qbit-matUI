import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { MainData, Torrent, GlobalTransferInfo } from '../../utils/Interfaces';


// UI Components
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ProgressBarMode } from '@angular/material/progress-bar';

// Helpers
import * as http_endpoints from '../../assets/http_config.json';
import { TorrentDataService } from '../torrent-data.service';
import { UnitsHelperService } from '../units-helper.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteTorrentDialogComponent } from '../delete-torrent-dialog/delete-torrent-dialog.component';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  private rawData: any;
  public allTorrentInformation: MainData;
  public allTorrentData : [Torrent];
  public cookieValueSID: string;

  // UI Components
  public tableColumns: string[] = ["Name", "Actions", "Size", "Progress", "Status", "Down_Speed", "Up_Speed", "ETA", "Completed_On"];
  public dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);

  // Other
  private DEFAULT_REFRESH_TIMEOUT = 2000
  private REFRESH_INTERVAL: any = null;
  private isFetchingData: boolean = false;
  private RID = 0;
  private deleteTorDialogRef: MatDialogRef<DeleteTorrentDialogComponent, any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private cookieService: CookieService, private TorrentService: TorrentDataService, private UnitConversion: UnitsHelperService, public deleteTorrentDialog: MatDialog) { }

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

  getFileSizeString(size: number): string {
    return this.UnitConversion.GetFileSizeString(size);
  }

  getTorrentETAString(tor: Torrent): string {
    let result = "∞";

    if(!tor.completion_on) {
      result = this.UnitConversion.GetSecondsString(tor.eta);
    }
    return result;
  }

  getCompletedOnString(timestamp: number): string {
    let dateCompleted = "";

    if(timestamp) {
      dateCompleted =  this.UnitConversion.GetDateString(timestamp);
    }
    return dateCompleted;
  }

  /**Get all torrent data */
  private getTorrentData(): void{
    
    // Don't request if we're already in the middle of one
    if(this.isFetchingData){
      return;
    }

    this.isFetchingData = true;
   
    this.TorrentService.GetAllTorrentData(this.RID)
    .subscribe((data: MainData) => 
    {
      this.updateDataSource(data);
    });
  }

  /** Pause a torrent
   * @param tor: The torrent in question.
   */
  handleTorrentPause(tor: Torrent) {
    alert(`PAUSE ${tor.name}`);
  }

  /** Open the modal for deleting a new torrent */
  openDeleteTorrentDialog(tor: Torrent): void {
    this.deleteTorDialogRef = this.deleteTorrentDialog.open(DeleteTorrentDialogComponent, {disableClose: true, data: {torrent: tor}});

    this.deleteTorDialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result.attemptedDelete) { this.torrentDeleteFinishCallback() }
    });
  }

  torrentDeleteFinishCallback(): void {
    this.deleteTorDialogRef.close();
    this.ResetAllTableData();   // TODO: Once merging deleted torrent changes are merged, this can be removed.
  }

  /**Update material table with new data */
  private async updateDataSource(data: MainData): Promise<void> {
    
    // Only set raw data initially
    if(!this.rawData){
      this.rawData = JSON.parse(JSON.stringify(data));
    }
    
    // Update state with new 
    // TODO: When a torrent gets removed, we need to refresh our data
    this.setFormattedResponse(data);

    this.allTorrentData = this.allTorrentInformation.torrents;
    this.isFetchingData = false;
    this.RID += 1;

    // Trigger update for table
    this.dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);
    this.dataSource.sort = this.sort;
  }


  /** Clean the response given from server */
  private setFormattedResponse(data: MainData) {

    let cleanTorrentData: [Torrent];

    // (1) If we already have some data, update it
    if(this.allTorrentInformation) {
      this.updateServerStatus(data.server_state);
      this.updateTorrentChanges(data.torrents);
    } else {
      this.allTorrentInformation = data;
    }

    // Re-format response
    for(const key of Object.keys(this.rawData.torrents)){
      this.rawData.torrents[key].hash = key;

      if(cleanTorrentData){
        cleanTorrentData.push(this.rawData.torrents[key]);
      } else {
        cleanTorrentData = [this.rawData.torrents[key]];
      }
      
    }

    this.allTorrentInformation.torrents = cleanTorrentData;
  }

  /** Update server status in changelog */
  private updateServerStatus(data: GlobalTransferInfo): void {
    if(!data) {
      return;
    }

    for(const key of Object.keys(data)){
      this.rawData.server_state[key] = data[key];
    }
  }

  private updateTorrentChanges(data: any) {
    if(!data) {
      return;
    }

    for(const key of Object.keys(data)){
      let torID = key;

      // If this torrent is new, create space for it
      if(!this.rawData.torrents[torID]) {
        this.rawData.torrents[torID] = {};
      }

      if(data[torID]){
        for(const torKey of Object.keys(data[torID])){
          this.rawData.torrents[torID][torKey] = data[torID][torKey]; 
        }
      }
    }
  }

  /**Set interval for getting torrents
   * @param interval (optional) The interval to set. 
   * If none is given, REFRESH_INTERVAL will be used.
   */
  private SetTorrentRefreshInterval(interval: number | void): void {
    let newInterval = interval || this.DEFAULT_REFRESH_TIMEOUT;
    this.REFRESH_INTERVAL = setInterval(() => this.getTorrentData(), newInterval);
  }

  /** Clear interval for getting new torrent data */
  private ClearTorrentRefreshInterval(): void {
    if (this.REFRESH_INTERVAL) { clearInterval(this.REFRESH_INTERVAL); }
  }

  /** Reset all data in torrents table. This will also grab the entire
   * torrent list again (rid = 0) via http request, and re-build the table.
   * 
   * NOTE: THIS MAY CAUSE PERFORMANCE ISSUES -- USE ONLY WHEN NEEDED.
   */
  private ResetAllTableData(): void {
    this.allTorrentInformation = null;
    this.allTorrentData = null;
    this.rawData = null;

    this.ClearTorrentRefreshInterval();
    this.SetTorrentRefreshInterval();

    this.RID = 0;   // Keep last to prevent race-condition
  }

  /** Determine if table is loading data or not */
  isLoading(): boolean {
    return this.allTorrentData == null;
  }

}
