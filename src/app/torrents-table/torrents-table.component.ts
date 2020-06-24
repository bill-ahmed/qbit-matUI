import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MainData, Torrent, NetworkConnection, UserPreferences } from '../../utils/Interfaces';


// UI Components
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSpinner } from '@angular/material/progress-spinner';

// Helpers
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteTorrentDialogComponent } from '../modals/delete-torrent-dialog/delete-torrent-dialog.component';
import { TorrentSearchServiceService } from '../services/torrent-search-service.service';
import { TorrentDataStoreService } from '../services/torrent-management/torrent-data-store.service';
import { PrettyPrintTorrentDataService } from '../services/pretty-print-torrent-data.service';
import { BulkUpdateTorrentsComponent } from './bulk-update-torrents/bulk-update-torrents.component';
import { SelectionModel } from '@angular/cdk/collections';
import { RowSelectionService } from '../services/torrent-management/row-selection.service';
import { TorrentInfoDialogComponent } from '../modals/torrent-info-dialog/torrent-info-dialog.component';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';
import { GetTorrentSearchName } from 'src/utils/Helpers';
import { MoveTorrentsDialogComponent } from '../modals/move-torrents-dialog/move-torrents-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { ApplicationConfigService } from '../services/app/application-config.service';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentInformation: MainData;
  public allTorrentData : Torrent[];
  public filteredTorrentData: Torrent[];
  public cookieValueSID: string;
  public isDarkTheme: Observable<boolean>;
  public userPref: UserPreferences = { } as UserPreferences;
  public pageSizeOptions = [10, 25, 50, 100, 500];
  selection = new SelectionModel<Torrent>(true, []);

  // UI Components
  public tableColumns: string[] = ["select", "Actions", "Name", "Size", "Progress", "Status", "Down_Speed", "Up_Speed", "ETA", "Completed_On"];
  public dataSource = new MatTableDataSource(this.filteredTorrentData ? this.filteredTorrentData : []);

  // Other
  private deleteTorDialogRef: MatDialogRef<DeleteTorrentDialogComponent, any>;
  private infoTorDialogRef: MatDialogRef<TorrentInfoDialogComponent, any>;
  private currentMatSort = {active: "Completed_On", direction: "desc"};
  private torrentSearchValue = "";
  private torrentsSelected: Torrent[] = [];     // Keep track of which torrents are currently selected
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private appConfig: ApplicationConfigService, private data_store: TorrentDataStoreService,
              private pp: PrettyPrintTorrentDataService, public deleteTorrentDialog: MatDialog, private infoTorDialog: MatDialog, private moveTorrentDialog: MatDialog,
              private torrentSearchService: TorrentSearchServiceService, private torrentsSelectedService: RowSelectionService,
              private theme: ThemeService) { }

  ngOnInit(): void {
    // Themeing
    this.isDarkTheme = this.theme.getThemeSubscription();

    // Subscribe to torrent searching service
    this.torrentSearchService.getSearchValue().subscribe((res: string) => {
      this.updateTorrentSearchValue(res);
    });

    // Get user preferences
    this.appConfig.getUserPreferences().then(res => { this.userPref = res });

    // Setup sorting and pagination
    this.dataSource.sort = this.sort;
    if(this.userPref?.web_ui_options?.torrent_table?.paginate) {
      this.pageSizeOptions.push(this.userPref.web_ui_options.torrent_table.default_items_per_page);
      this.pageSizeOptions.sort();
    }

    // Retrieve all torrent data first, then update torrent data on interval
    this.allTorrentData = null;
    this.filteredTorrentData = null;
    this.data_store.GetTorrentDataSubscription().subscribe(data => { if(data) { this.updateTorrentData(data) }})

    // Which torrents are selected
    this.torrentsSelectedService.getTorrentsSelected().subscribe(res => {

      // If empty, clear selection
      if(res.length === 0) {
        this.selection.clear();
      }
    });
  }

  ngOnDestroy(): void { }

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
  private async updateTorrentData(data): Promise<void>{

    // Update state with fresh torrent data
    this.allTorrentInformation = data;
    this.allTorrentData = data.torrents;
    this.filteredTorrentData = data.torrents;

    // Re-sort data
    this.onMatSortChange(this.currentMatSort);

    // Filter by any search criteria
    this.updateTorrentsBasedOnSearchValue();

    if(this.userPref?.web_ui_options?.torrent_table?.paginate) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private updateTorrentSearchValue(val: string): void {
    val = val ?? "";  // In case null is given
    this.torrentSearchValue = GetTorrentSearchName(val);

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
        return GetTorrentSearchName(tor.name).includes(this.torrentSearchValue);
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

  forceStartTorrentsBulk(tor: Torrent[]) {
    this.data_store.ForceStartTorrents(tor).subscribe(res => { });
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
  }

  /** Open the modal for deleting a new torrent */
  openDeleteTorrentDialog(event: any, tors: Torrent[]): void {
    if(event) { event.stopPropagation() };

    this.deleteTorDialogRef = this.deleteTorrentDialog.open(DeleteTorrentDialogComponent, {disableClose: true, data: {torrent: tors}, panelClass: "generic-dialog"});

    this.deleteTorDialogRef.afterClosed().subscribe((result: any) => {
      if (result.attemptedDelete) { this.torrentDeleteFinishCallback() }
    });
  }

  /** Open modal for viewing details torrent information */
  openInfoTorrentDialog(event: any, tor: Torrent): void {
    if(event) { event.stopPropagation(); }

    this.infoTorDialogRef = this.infoTorDialog.open(TorrentInfoDialogComponent, {data: {torrent: tor}, autoFocus: false, panelClass: "generic-dialog"})

    this.infoTorDialogRef.afterClosed().subscribe((result: any) => {
    })
  }

  /** Open the modal for adding a new torrent */
  openMoveTorrentDialog(): void {
    const addTorDialogRef = this.moveTorrentDialog.open(MoveTorrentsDialogComponent, {disableClose: true, panelClass: "generic-dialog"});

    addTorDialogRef.afterClosed().subscribe((result: any) => {
    });
  }

  public handleBulkEditChange(result?: string): void {

    const _close = () => {
      this._updateSelectionService();
    }

    const _clearAndClose = () => {
      this.selection.clear();
      _close();
    }

    // Depending on the result, we need to do different actions
    if(result) {
      switch (result) {
        case "cancel":
          _close();
          break;
        case "delete":
          this.openDeleteTorrentDialog(null, this.selection.selected);
          break;

        case "pause":
          this.pauseTorrentsBulk(this.selection.selected);
          _close();
          break;

        case "play":
          this.resumeTorrentsBulk(this.selection.selected);
          _close();
          break;

        case "forceStart":
          this.forceStartTorrentsBulk(this.selection.selected);
          _close();

        case "increasePrio":
          this.increasePriorityBulk(this.selection.selected);
          _close();
          break;

        case "decreasePrio":
          this.decreasePriorityBulk(this.selection.selected);
          _close();
          break;

        case "maxPrio":
          this.maximumPriorityBulk(this.selection.selected);
          _close();
          break;

        case "minPrio":
          this.minimumPriorityBulk(this.selection.selected);
          _close();
          break;

        case "moveTorrent":
          this.openMoveTorrentDialog();
          _close();

        default:
          break;
      }
    }
  }

  torrentDeleteFinishCallback(): void {
    this.selection.clear();
    this._updateSelectionService();
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
      case "Progress":
        this._sortByNumber("progress", event.direction);
        break;
      case "Down_Speed":
        this._sortByNumber("dlspeed", event.direction);
        break;
      case "Up_Speed":
        this._sortByNumber("upspeed", event.direction);
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

  /** Determine if torrent is in a error state */
  public isTorrentError(tor: Torrent): boolean {
    let errors = ['error', 'stalledUP', 'stalledDL', 'unknown'];
    return errors.includes(tor.state);
  }

  private refreshDataSource(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.filteredTorrentData ? this.filteredTorrentData : []);
  }

  /** Reset all data in torrents table. This will also grab the entire
   * torrent list again (rid = 0) via http request, and re-build the table.
   *
   * NOTE: THIS MAY CAUSE PERFORMANCE ISSUES -- USE ONLY WHEN NEEDED.
   *
   * @deprecated This method is no longer guaranteed to nuke the torrent table
   */
  private ResetAllTableData(): void {
    this.handleBulkEditChange();
    this.selection.clear();
    this.torrentsSelectedService.clearSelection();

    this.allTorrentInformation = null;
    this.allTorrentData = null;
    this.filteredTorrentData = null;

    this.data_store.ResetAllData();
  }

  /** Determine if table is loading data or not */
  isLoading(): boolean {
    return this.allTorrentData == null;
  }

}
