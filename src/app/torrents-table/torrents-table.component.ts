import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { MainData, Torrent } from '../../utils/Interfaces';


// UI Components
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProgressBarMode } from '@angular/material/progress-bar';

// Helpers
import * as http_endpoints from '../../assets/http_config.json';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteTorrentDialogComponent } from '../delete-torrent-dialog/delete-torrent-dialog.component';
import { TorrentSearchServiceService } from '../services/torrent-search-service.service';
import { TorrentDataStoreService } from '../services/torrent-management/torrent-data-store.service';
import { PrettyPrintTorrentDataService } from '../services/pretty-print-torrent-data.service';
import { BulkUpdateTorrentsComponent } from './bulk-update-torrents/bulk-update-torrents.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentInformation: MainData;
  public allTorrentData : Torrent[];
  public cookieValueSID: string;
  selection = new SelectionModel<Torrent>(true, []);

  // UI Components
  public tableColumns: string[] = ["select", "Actions", "Name", "Size", "Progress", "Status", "Down_Speed", "Up_Speed", "ETA", "Completed_On"];
  public dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);

  // Other
  private DEFAULT_REFRESH_TIMEOUT = 1000
  private REFRESH_INTERVAL: any = null;
  private isFetchingData: boolean = false;
  private RID = 0;
  private deleteTorDialogRef: MatDialogRef<DeleteTorrentDialogComponent, any>;
  private currentMatSort = {active: "Completed_On", direction: "desc"};
  private torrentSearchValue = "";
  private torrentsSelected: Torrent[] = [];    // Keep track of which torrents are currently selected
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private cookieService: CookieService, private data_store: TorrentDataStoreService, 
    private pp: PrettyPrintTorrentDataService, public deleteTorrentDialog: MatDialog, private torrentSearchService: TorrentSearchServiceService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // Subscribe to torrent searching service
    this.torrentSearchService.getSearchValue().subscribe((res: string) => {
      this.updateTorrentSearchValue(res);
    })

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

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  areTorrentsSelected(): boolean {
    return this.torrentsSelected.length === 0;
  }

  isTorrentPaused(tor: Torrent): boolean {
    return tor.state === "pausedDL" || tor.state === "pausedUP";
  }

  getFileSizeString(size: number): string {
    return this.pp.pretty_print_file_size(size);
  }

  getStatusString(status: string): string {
    return this.pp.pretty_print_status(status);
  }

  getTorrentETAString(tor: Torrent): string {
    return this.pp.pretty_print_eta(tor);
  }

  getCompletedOnString(timestamp: number): string {
    return this.pp.pretty_print_completed_on(timestamp);
  }

  /** Get all torrent data and update the table */
  private async getTorrentData(): Promise<void>{
    
    // Don't request if we're already in the middle of one
    if(this.isFetchingData){
      return;
    }

    this.isFetchingData = true;
    let data = await this.data_store.GetTorrentData(this.RID);

    // Update state with fresh torrent data
    this.allTorrentInformation = data;
    this.allTorrentData = data.torrents;
    this.isFetchingData = false;
    this.RID += 1;

    // Re-sort data
    this.onMatSortChange(this.currentMatSort);

    // Filter by any search criteria
    this.updateTorrentsBasedOnSearchValue();
  }

  private updateTorrentSearchValue(val: string): void {
    let newVal =  val.trim().toLowerCase();
    this.torrentSearchValue = newVal;

    // User is searching for something
    if(newVal) { this.updateTorrentsBasedOnSearchValue() } 

    else { this.getTorrentData() }  // They've back-spaced out of their query; update immediately
  }

  /** Callback for when user is searching for a torrent. Filter all torrents displayed that match torrent criteria */
  updateTorrentsBasedOnSearchValue(): void {

    // If a search value is given, then do the work
    if(this.allTorrentData && this.torrentSearchValue) {
      this.allTorrentData = this.allTorrentData
      .filter((tor: Torrent) => {
        return tor.name.toLowerCase().includes(this.torrentSearchValue);
      });

      this.refreshDataSource();
    }
  }

  /** Pause a torrent
   * @param tor: The torrent in question.
   */
  handleTorrentPause(event: any, tor: Torrent) {
    event.stopPropagation();    // Don't trigger row selection
    alert(`PAUSE ${tor.name}`);
  }
  
  /** Callback for when a torrent is selected in the table.
   * @param event The event thrown.
   */
  handleTorrentSelected(tor: Torrent): void {
    this.selection.toggle(tor);
  }

  /** Open the modal for deleting a new torrent */
  openDeleteTorrentDialog(event: any, tors: Torrent[]): void {
    event.stopPropagation();

    this.deleteTorDialogRef = this.deleteTorrentDialog.open(DeleteTorrentDialogComponent, {disableClose: true, data: {torrent: tors}});

    this.deleteTorDialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result.attemptedDelete) { this.torrentDeleteFinishCallback() }
    });
  }

  /** Open snackbar for deleting/pausing/playing torrents */
  openSnackBar(): void {
    let snackbarREF = this.snackBar.openFromComponent(BulkUpdateTorrentsComponent, 
      {
        data: this.torrentsSelected
      }
    );

    snackbarREF.afterDismissed().subscribe(
      (result: any) => {
        console.log("Finished bulk edit.", result);
    }, (error: any) => {
      console.error("Error with bulk edit.", error);
    } );
  }

  torrentDeleteFinishCallback(): void {
    this.deleteTorDialogRef.close();
    this.ResetAllTableData();   // TODO: Once merging deleted torrent changes are included, this can be removed.
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

  onMatSortChange(event: any): void {
    this.currentMatSort = event;
    switch (event.active) {
      case "Name":
        this.sortTorrentsByName(event.direction);
        break;
      case "Completed_On":
        this.sortTorrentsByCompletedOn(event.direction);
        break;
      case "Status":
        this.sortTorrentsByStatus(event.direction);
        break;
      case "Size":
        this.sortTorrentsBySize(event.direction);
        break;

      default:
        return;
    }
    this.refreshDataSource();
  }

  private sortTorrentsByName(direction: string): void {
    this.allTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a.name === b.name ? 0 : (a.name < b.name ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private sortTorrentsByCompletedOn(direction: string): void {
    this.allTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a.completion_on === b.completion_on ? 0 : (a.completion_on < b.completion_on ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private sortTorrentsByStatus(direction: string): void {
    this.allTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a.state === b.state ? 0 : (a.state < b.state ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private sortTorrentsBySize(direction: string): void {
    this.allTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a.size === b.size ? 0 : (a.size < b.size ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private refreshDataSource(): void {
    this.dataSource = new MatTableDataSource(this.allTorrentData ? this.allTorrentData : []);
    this.dataSource.sort = this.sort;
  }

  /** Reset all data in torrents table. This will also grab the entire
   * torrent list again (rid = 0) via http request, and re-build the table.
   * 
   * NOTE: THIS MAY CAUSE PERFORMANCE ISSUES -- USE ONLY WHEN NEEDED.
   */
  private ResetAllTableData(): void {
    this.allTorrentInformation = null;
    this.allTorrentData = null;
    this.RID = 0;

    this.data_store.ResetAllData();
    this.ClearTorrentRefreshInterval();
    this.SetTorrentRefreshInterval();
  }

  /** Determine if table is loading data or not */
  isLoading(): boolean {
    return this.allTorrentData == null;
  }

}
