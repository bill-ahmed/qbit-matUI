import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkDragStart, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { MainData, Torrent, UserPreferences } from '../../utils/Interfaces';


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
import { TorrentHelperService } from '../services/torrent-management/torrent-helper.service';
import { SnackbarService } from '../services/notifications/snackbar.service';
import { MatMenuTrigger } from '@angular/material/menu';

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

  public isDarkTheme: Observable<boolean>;
  public userPref: UserPreferences = { } as UserPreferences;

  public DEFUALT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 500]
  public pageSizeOptions = this.DEFUALT_PAGE_SIZE_OPTIONS;
  selection = new SelectionModel<Torrent>(true, []);

  // UI Components
  public dataSource = new MatTableDataSource([]);

  // For drag & drop of columns
  public displayedColumns: any[];

  // Right-click on row options
  public menuTopLeftPosition = {x: '0', y: '0'};
  @ViewChild(MatMenuTrigger, {static: true}) torrentMenuTrigger: MatMenuTrigger;

  // Other
  private deleteTorDialogRef: MatDialogRef<DeleteTorrentDialogComponent, any>;
  private infoTorDialogRef: MatDialogRef<TorrentInfoDialogComponent, any>;
  private currentMatSort = {active: "Completed On", direction: "desc"};
  private torrentSearchValue = "";
  private torrentsSelected: Torrent[] = [];     // Keep track of which torrents are currently selected

  // Keep track of table header width, so the rows also match
  public tableHeaderWidth: string = '-1px';

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private appConfig: ApplicationConfigService, private data_store: TorrentDataStoreService,
              private pp: PrettyPrintTorrentDataService, public deleteTorrentDialog: MatDialog, private infoTorDialog: MatDialog, private moveTorrentDialog: MatDialog,
              private torrentSearchService: TorrentSearchServiceService, private torrentsSelectedService: RowSelectionService, private snackbar: SnackbarService,
              private theme: ThemeService) { }

  ngOnInit(): void {
    // Themeing
    this.isDarkTheme = this.theme.getThemeSubscription();

    // Subscribe to torrent searching service
    this.torrentSearchService.getSearchValue().subscribe((res: string) => {
      this.updateTorrentSearchValue(res);
    });

    // Get user preferences
    this.appConfig.getUserPreferencesSubscription().subscribe(res => { this.setUserPreferences(res) });

    // Setup sorting and pagination
    this.dataSource.sort = this.sort;

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

  getTorrentUploadedString(tor: Torrent): string {
    return this.pp.pretty_print_uploaded(tor);
  }

  getTorrentRatioString(tor: Torrent): number {
    return this.pp.pretty_print_ratio(tor);
  }

  getCompletedOnString(timestamp: number): string {
    return this.pp.pretty_print_completed_on(timestamp);
  }

  /** Hacky fix for table header not taking entire width of the table :( */
  setTableHeaderWidth() {
    let elem = document.getElementById('torrent_table_header_row')
    this.tableHeaderWidth = `${elem?.scrollWidth || -1}px`;
  }

  onPaignationPageChanged() {
    let items_per_page = this.userPref.web_ui_options.torrent_table.default_items_per_page;
    this.pageSizeOptions = [...this.DEFUALT_PAGE_SIZE_OPTIONS, items_per_page]

    // Remove duplicates & sort
    this.pageSizeOptions = [...new Set(this.pageSizeOptions)];
    this.pageSizeOptions.sort();
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

    this.setTableHeaderWidth();
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
    this.data_store.PauseTorrents(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Paused "${tor[0].name}".` : `Paused ${tor.length} torrent(s)`)
    });
  }

  /** Resume given array of torrents
   * @param tor The torrents in question
   */
  resumeTorrentsBulk(tor: Torrent[]) {
    this.data_store.ResumeTorrents(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Resumed "${tor[0].name}".` : `Resumed ${tor.length} torrent(s)`)
    });
  }

  forceStartTorrentsBulk(tor: Torrent[]) {
    this.data_store.ForceStartTorrents(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Force started "${tor[0].name}".` : `Force started ${tor.length} torrent(s)`)
    });
  }

  increasePriorityBulk(tor: Torrent[]) {
    this.data_store.IncreaseTorrentPriority(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Increased priority for "${tor[0].name}".` : `Increased priority for ${tor.length} torrent(s)`)
    });
  }

  decreasePriorityBulk(tor: Torrent[]) {
    this.data_store.DecreaseTorrentPriority(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Decreased priority for "${tor[0].name}".` : `Decreased priority for ${tor.length} torrent(s)`)
    })
  }

  maximumPriorityBulk(tor: Torrent[]) {
    this.data_store.AssignTopPriority(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Maximum priority for "${tor[0].name}".` : `Maximum priority for ${tor.length} torrent(s)`)
    });
  }

  minimumPriorityBulk(tor: Torrent[]) {
    this.data_store.AssignLowestPriority(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Minimum priority for "${tor[0].name}".` : `Minimum priority for ${tor.length} torrent(s)`)
    });
  }

  /** Callback for when user finished dragging & dropping a column */
  public handleColumnDragStopped(event: any) {
    if(event) {
      moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
      this.appConfig.setTorrentTableColumns(this.displayedColumns);
    }
  }

  /** Callback for when a torrent is selected in the table. Update row selection service with new data
   * @param event The event thrown.
   */
  handleTorrentSelected(tor: Torrent): void {
    this.selection.toggle(tor);
    this._updateSelectionService();
  }

  /** Determine whether a torrent is selected or not */
  isSelected(tor: Torrent): boolean {
    return this.selection.isSelected(tor);
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
    this.infoTorDialogRef.afterClosed().subscribe((result: any) => { })
  }

  /** Open the modal for adding a new torrent */
  openMoveTorrentDialog(): void {
    const addTorDialogRef = this.moveTorrentDialog.open(MoveTorrentsDialogComponent, {disableClose: true, panelClass: "generic-dialog"});

    addTorDialogRef.afterClosed().subscribe((result: any) => { });
  }

  public handleBulkEditChange(result?: string): void {

    const _close = () => {
      this._updateSelectionService();
    }

    const actions = {
      'cancel': () => _close(),
      'delete': () => this.openDeleteTorrentDialog(null, this.selection.selected),
      'pause': () => this.pauseTorrentsBulk(this.selection.selected),
      'play': () => this.resumeTorrentsBulk(this.selection.selected),
      'forceStart': () => this.forceStartTorrentsBulk(this.selection.selected),
      'increasePrio': () => this.increasePriorityBulk(this.selection.selected),
      'decreasePrio': () => this.decreasePriorityBulk(this.selection.selected),
      'maxPrio': () => this.maximumPriorityBulk(this.selection.selected),
      'minPrio': () => this.minimumPriorityBulk(this.selection.selected),
      'moveTorrent': () => this.openMoveTorrentDialog()
    }

    if(result && actions[result]) {
      actions[result]();
    }
    else {
      this.snackbar.enqueueSnackBar(`Unable to perform the bulk action ${result}!`, { type: 'error' });
    }

    _close();
  }

  /** After torrent delete action is completed */
  torrentDeleteFinishCallback(): void {
    this.selection.clear();
    this._updateSelectionService();
  }

  onMatSortChange(event: any): void {
    // If data not yet loaded, exit
    if(!this.filteredTorrentData) { return; }

    this.currentMatSort = event;

    TorrentHelperService.sortByField(event.active, event.direction, this.filteredTorrentData);
    this.refreshDataSource();
  }

  /** When user right-clicks on a torrent row */
  onTorrentRightClick(event: MouseEvent, item: Torrent) {
    event.preventDefault();


    // If torrent not already selected, select it
    if(!this.isSelected(item))
      this.handleTorrentSelected(item);

    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    this.torrentMenuTrigger.openMenu();
  }

  public shouldRenderColumn(col_name: string): boolean {
    return this.displayedColumns.includes(col_name);
  }

  private setUserPreferences(pref: UserPreferences) {
    this.userPref = pref;

    let torren_table_pref = pref.web_ui_options?.torrent_table
    let table_sort_opt = torren_table_pref?.default_sort_order;

    // Whether to enable pagination or not
    if(this.userPref?.web_ui_options?.torrent_table?.paginate) {
      this.dataSource.paginator = this.paginator;
      this.onPaignationPageChanged();
    }

    this.currentMatSort = table_sort_opt ? {
      active: table_sort_opt.column_name.replace(/\s/, '_'),
      direction: table_sort_opt.order
    } : this.currentMatSort

    // Column order
    this.displayedColumns = pref.web_ui_options?.torrent_table?.columns_to_show;

    // Re-sort data
    this.onMatSortChange(this.currentMatSort);
  }

  public isTorrentPrimaryAction(tor: Torrent): boolean {
    let actions = ['downloading', 'moving'];
    return actions.includes(tor.state);
  }

  /** Determine if torrent is in a error state */
  public isTorrentError(tor: Torrent): boolean {
    let errors = ['missingFiles', 'error', 'unknown'];
    return errors.includes(tor.state);
  }

  public isTorrentsEmpty() {
    return this.filteredTorrentData?.length === 0;
  }

  private refreshDataSource(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.data = (this.filteredTorrentData ? this.filteredTorrentData : []);
  }

  /** Determine if table is loading data or not */
  isLoading(): boolean {
    return this.allTorrentData == null;
  }
}
