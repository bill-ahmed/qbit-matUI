import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { MainData, Torrent, NetworkConnection } from '../../utils/Interfaces';


// UI Components
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';
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
import { RowSelectionService } from '../services/torrent-management/row-selection.service';
import { TorrentInfoDialogComponent } from '../torrent-info-dialog/torrent-info-dialog.component';
import { NetworkConnectionInformationService } from '../services/network/network-connection-information.service';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentInformation: MainData;
  public allTorrentData : Torrent[];
  public filteredTorrentData: Torrent[];
  public cookieValueSID: string;
  public bulkEditOpen: boolean = false;        // Is bulk edit open or not
  public isDarkTheme: Observable<boolean>;
  selection = new SelectionModel<Torrent>(true, []);

  // UI Components
  public tableColumns: string[] = ["select", "Actions", "Name", "Size", "Progress", "Status", "Down_Speed", "Up_Speed", "ETA", "Completed_On"];
  public dataSource = new MatTableDataSource(this.filteredTorrentData ? this.filteredTorrentData : []);

  // Other
  private DEFAULT_REFRESH_TIMEOUT: number;
  private REFRESH_INTERVAL: any = null;
  private isFetchingData: boolean = false;
  private RID = 0;
  private deleteTorDialogRef: MatDialogRef<DeleteTorrentDialogComponent, any>;
  private infoTorDialogRef: MatDialogRef<TorrentInfoDialogComponent, any>;
  private snackbarREF: MatSnackBarRef<BulkUpdateTorrentsComponent>;
  private currentMatSort = {active: "Completed_On", direction: "desc"};
  private torrentSearchValue = "";
  private torrentsSelected: Torrent[] = [];     // Keep track of which torrents are currently selected
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private cookieService: CookieService, private data_store: TorrentDataStoreService,
              private pp: PrettyPrintTorrentDataService, public deleteTorrentDialog: MatDialog, private infoTorDialog: MatDialog,
              private torrentSearchService: TorrentSearchServiceService, private torrentsSelectedService: RowSelectionService ,private snackBar: MatSnackBar,
              private networkInfo: NetworkConnectionInformationService, private theme: ThemeService) { }

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
    this.filteredTorrentData = null;

    // How frequently to fetch data
    this.DEFAULT_REFRESH_TIMEOUT = this.networkInfo.get_recommended_torrent_refresh_interval();
    this.SetTorrentRefreshInterval();

    // When the user's network status changes, update it in state
    this.networkInfo.get_network_change_subscription().subscribe((update: NetworkConnection) => {
      this.DEFAULT_REFRESH_TIMEOUT = this.networkInfo.get_recommended_torrent_refresh_interval()
      this.SetTorrentRefreshInterval();
      console.log("updated interval", this.DEFAULT_REFRESH_TIMEOUT);
    })

    // Themeing
    this.isDarkTheme = this.theme.getThemeSubscription();
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
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this._updateSelectionService();
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
    this.filteredTorrentData = data.torrents;
    this.isFetchingData = false;
    this.RID += 1;

    // Re-sort data
    this.onMatSortChange(this.currentMatSort);

    // Filter by any search criteria
    this.updateTorrentsBasedOnSearchValue();
  }

  private updateTorrentSearchValue(val: string): void {
    val = val || "";  // In case null is given
    this.torrentSearchValue = val.trim().toLowerCase();

    // User is searching for something
    this.updateTorrentsBasedOnSearchValue()
  }

  /** Callback for when user is searching for a torrent. Filter all torrents displayed that match torrent criteria
   *
   * NOTE: If search value in state is empty, no filtering is done
  */
  updateTorrentsBasedOnSearchValue(): void {

    // If a search value is given, then do the work
    if(this.allTorrentData && this.torrentSearchValue) {
      this.filteredTorrentData = this.allTorrentData
      .filter((tor: Torrent) => {
        return tor.name.toLowerCase().includes(this.torrentSearchValue);
      });

      this.refreshDataSource();
    }
    else if(this.torrentSearchValue === "") {   // If searching for value is empty, restore filteredTorrentData
      this.filteredTorrentData = this.allTorrentData
    }
  }

  /** Pause given array of torrents
   * @param tor The torrents in question.
   */
  pauseTorrentsBulk(tor: Torrent[]) {
    this.data_store.PauseTorrents(tor).subscribe(res => { });
  }

  /** Resume given array of torrents
   * @param tor The torrents in question
   */
  resumeTorrentsBulk(tor: Torrent[]) {
    this.data_store.ResumeTorrents(tor).subscribe(res => { });
  }

  increasePriorityBulk(tor: Torrent[]) {
    this.data_store.IncreaseTorrentPriority(tor).subscribe(res => { });
  }

  decreasePriorityBulk(tor: Torrent[]) {
    this.data_store.DecreaseTorrentPriority(tor).subscribe(res => { })
  }

  maximumPriorityBulk(tor: Torrent[]) {
    this.data_store.AssignTopPriority(tor).subscribe(res => { });
  }

  minimumPriorityBulk(tor: Torrent[]) {
    this.data_store.AssignLowestPriority(tor).subscribe(res => { });
  }

  /** Callback for when a torrent is selected in the table. Update row selection service with new data
   * @param event The event thrown.
   */
  handleTorrentSelected(tor: Torrent): void {
    this.selection.toggle(tor);
    this._updateSelectionService();
  }

  _updateSelectionService() {
    this.torrentsSelectedService.updateTorrentsSelected(this.selection.selected.map(elem => elem.hash));
    if(this.selection.selected.length > 0)  {   // If user has selected at least one torrent
      if(!this.snackbarREF) { // And bulk edit isn't already open
        this.openBulkEdit()
      }
    }
    else { this.closeBulkEdit() } // Otherwise, close it
  }

  /** Open the modal for deleting a new torrent */
  openDeleteTorrentDialog(event: any, tors: Torrent[]): void {
    if(event) { event.stopPropagation() };

    this.deleteTorDialogRef = this.deleteTorrentDialog.open(DeleteTorrentDialogComponent, {disableClose: true, data: {torrent: tors}, panelClass: "generic-dialog"});

    this.deleteTorDialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result.attemptedDelete) { this.torrentDeleteFinishCallback() }
    });
  }

  /** Open modal for viewing details torrent information */
  openInfoTorrentDialog(event: any, tor: Torrent): void {
    if(event) { event.stopPropagation(); }

    this.infoTorDialogRef = this.infoTorDialog.open(TorrentInfoDialogComponent, {data: {torrent: tor}, autoFocus: false, panelClass: "generic-dialog"})

    this.infoTorDialogRef.afterClosed().subscribe((result: any) => {
      console.log("Closed info modal", result);
    })
  }

  /** Open snackbar for bulk editing deleting/pausing/playing torrents */
  public openBulkEdit(): void {
    this.bulkEditOpen = true;
  }

  public closeBulkEdit(result?: string): void {

    const _clearAndClose = () => {
      this.bulkEditOpen = false;
      this.selection.clear();
    }

    // Depending on the result, we need to do different actions
    if(result) {
      switch (result) {
        case "cancel":
          _clearAndClose();
          break;
        case "delete":
          this.openDeleteTorrentDialog(null, this.selection.selected);
          break;

        case "pause":
          console.log("pause torrents")
          this.pauseTorrentsBulk(this.selection.selected);
          _clearAndClose();
          break;

        case "play":
          this.resumeTorrentsBulk(this.selection.selected);
          _clearAndClose();
          break;

        case "increasePrio":
          this.increasePriorityBulk(this.selection.selected);
          _clearAndClose();
          break;

        case "decreasePrio":
          this.decreasePriorityBulk(this.selection.selected);
          _clearAndClose();
          break;

        case "maxPrio":
          this.maximumPriorityBulk(this.selection.selected);
          _clearAndClose();
          break;

        case "minPrio":
          this.minimumPriorityBulk(this.selection.selected);
          _clearAndClose();
          break;

        default:
          break;
      }
    } else {
      this.bulkEditOpen = false;  // If no event emitted, then it was an internal call
    }
  }

  public isBulkEditOpen(): boolean {
    return this.bulkEditOpen;
  }

  torrentDeleteFinishCallback(): void {
    this.deleteTorDialogRef.close();
    this.ResetAllTableData();   // TODO: Once merging deleted torrent changes are included, this can be removed.
  }

  /**Set interval for getting torrents
   * @param interval (optional) The interval to set.
   * If none is given, REFRESH_INTERVAL will be used.
   */
  private SetTorrentRefreshInterval(interval?: number): void {
    this.ClearTorrentRefreshInterval();

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
      case "ETA":
        this.sortByETA(event.direction);
        break;

      default:
        return;
    }
    this.refreshDataSource();
  }

  private sortTorrentsByName(direction: string): void {
    this.filteredTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a.name === b.name ? 0 : (a.name < b.name ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private sortTorrentsByCompletedOn(direction: string): void {
    this._sortByNumber("completion_on", direction);
  }

  private sortTorrentsByStatus(direction: string): void {
    this.filteredTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a.state === b.state ? 0 : (a.state < b.state ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private sortTorrentsBySize(direction: string): void {
    this._sortByNumber("size", direction);
  }

  private sortByETA(direction: string): void {
    this._sortByNumber("eta", direction);
  }

  /** Sort a object's property that is a number */
  private _sortByNumber(field: string, direction: string): void {
    this.filteredTorrentData.sort((a: Torrent, b: Torrent) => {
      let res = (a[field] === b[field] ? 0 : (a[field] < b[field] ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  private refreshDataSource(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.filteredTorrentData ? this.filteredTorrentData : []);
  }

  /** Reset all data in torrents table. This will also grab the entire
   * torrent list again (rid = 0) via http request, and re-build the table.
   *
   * NOTE: THIS MAY CAUSE PERFORMANCE ISSUES -- USE ONLY WHEN NEEDED.
   */
  private ResetAllTableData(): void {
    this.closeBulkEdit();
    this.selection.clear();

    this.allTorrentInformation = null;
    this.allTorrentData = null;
    this.filteredTorrentData = null;
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
