import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MainData, Torrent, UserPreferences } from '../../utils/Interfaces';

// UI Components
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
import { GetTorrentSearchName, IsMobileUser } from 'src/utils/Helpers';
import { MoveTorrentsDialogComponent } from '../modals/move-torrents-dialog/move-torrents-dialog.component';
import { ApplicationConfigService } from '../services/app/application-config.service';
import { TorrentHelperService } from '../services/torrent-management/torrent-helper.service';
import { SnackbarService } from '../services/notifications/snackbar.service';
import { MenuItem } from 'primeng/api';
import { getClassForStatus } from '../../utils/Helpers'
import { Constants } from 'src/constants';
import { TorrentFilter, TorrentFilterService } from '../services/torrent-filter-service.service';


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

  selection = new SelectionModel<Torrent>(true, []);

  // For drag & drop of columns
  public displayedColumns: any[];

  // A reverse mapping from column name to torrent property
  public displayedColumnsMapping = ApplicationConfigService.TORRENT_TABLE_COLUMNS_MAPPING

  public colWidths = Constants.TORRENT_TABLE_COLUMNS_WIDTHS as any;

  // Context menu items
  public contextMenuItems: MenuItem[];
  public contextMenuSelectedTorrent: Torrent;

  public isMobileUser = IsMobileUser();

  // Other
  private deleteTorDialogRef: MatDialogRef<DeleteTorrentDialogComponent, any>;
  private infoTorDialogRef: MatDialogRef<TorrentInfoDialogComponent, any>;
  private currentMatSort = {active: "Completed On", direction: "desc"};

  private torrentSearchValue = ""; // Keep track of which torrents are currently selected
  private torrentFilterBy: TorrentFilter = { type: '', value: '' };

  // When user right-clicks a row in the torrent table, so we can choose what to do with it
  public torrentRightClicked: Torrent = null;

  constructor(private appConfig: ApplicationConfigService, private data_store: TorrentDataStoreService,
              private pp: PrettyPrintTorrentDataService, public deleteTorrentDialog: MatDialog, private infoTorDialog: MatDialog, private moveTorrentDialog: MatDialog,
              private torrentSearchService: TorrentSearchServiceService, private filterService: TorrentFilterService, private torrentsSelectedService: RowSelectionService,
              private snackbar: SnackbarService, private theme: ThemeService) { }

  ngOnInit(): void {
    // Theming
    this.isDarkTheme = this.theme.getThemeSubscription();

    // Subscribe to torrent searching service
    this.torrentSearchService.getSearchValue().subscribe((res: string) => {
      this.updateTorrentSearchValue(res);
    });

    // Filtering torrents
    this.filterService.getFilterValue().subscribe((res: TorrentFilter) => {
      // TODO: Account for different filter types
      this.updateFilterValue(res);
    })

    // Get user preferences
    this.appConfig.getUserPreferencesSubscription().subscribe(res => { this.setUserPreferences(res) });

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

    this.contextMenuItems = [
      { label: 'More Info', icon: 'pi pi-fw pi-info-circle', command: () => this.openInfoTorrentDialog(null, this.torrentRightClicked) },
      { label: 'Pause', icon: 'pi pi-fw pi-pause', command: () => this.pauseTorrentsBulk(this.selection.selected) },
      { label: 'Resume', icon: 'pi pi-fw pi-play', command: () => this.resumeTorrentsBulk(this.selection.selected) },
      { label: 'Force Resume', icon: 'pi pi-fw pi-forward', command: () => this.forceStartTorrentsBulk(this.selection.selected) },
      { /* Divider */ },
      { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => this.openDeleteTorrentDialog(null, this.selection.selected) },
      { /* Divider */ },
      { label: 'Set location...', icon: 'pi pi-fw pi-folder', command: () => this.openMoveTorrentDialog() },
      { label: 'Force recheck', icon: 'pi pi-fw pi-refresh', command: () => this.recheckTorrents(this.selection.selected) },
      { /* Divider */ },
      { label: 'Increase Priority', icon: 'pi pi-fw pi-chevron-up', command: () => this.increasePriorityBulk(this.selection.selected) },
      { label: 'Decrease Priority', icon: 'pi pi-fw pi-chevron-down', command: () => this.decreasePriorityBulk(this.selection.selected) },
      { label: 'Max Priority', icon: 'pi pi-fw pi-angle-double-up', command: () => this.maximumPriorityBulk(this.selection.selected) },
      { label: 'Min Priority', icon: 'pi pi-fw pi-angle-double-down', command: () => this.minimumPriorityBulk(this.selection.selected) },
    ];
  }

  ngOnDestroy(): void { }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    return numSelected === this.filteredTorrentData.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.filteredTorrentData.forEach(row => this.selection.select(row));
    this._updateSelectionService();
  }

  isTorrentPaused(tor: Torrent): boolean {
    return tor.state === "pausedDL" || tor.state === "pausedUP";
  }

  getFileSizeString(size: number): string         { return this.pp.pretty_print_file_size(size); }
  getStatusString(status: string): string         { return this.pp.pretty_print_status(status); }
  getTorrentETAString(tor: Torrent): string       { return this.pp.pretty_print_eta(tor); }
  getTorrentUploadedString(tor: Torrent): string  { return this.pp.pretty_print_uploaded(tor); }
  getTorrentRatioString(tor: Torrent): number     { return this.pp.pretty_print_ratio(tor); }
  getCompletedOnString(timestamp: number): string { return this.pp.pretty_print_completed_on(timestamp); }
  getTrackerString(tracker: string): string       { return this.pp.pretty_print_tracker(tracker); }

  getClassNameForColumns(column: string): string {
    return 'table-col table-col-' + column.replace(/ /g, '-')
  }

  getIdForColumns(column: string): string {
    return column.replace(/ /g, '-');
  }

  trackBy(index: number, item: Torrent) { return item.hash; }

  /** Get all torrent data and update the table */
  private async updateTorrentData(data): Promise<void>{

    // Update state with fresh torrent data
    this.allTorrentInformation = data;
    this.allTorrentData = data.torrents;
    this.filteredTorrentData = data.torrents;

    // Re-sort data
    this.handleSortChange(this.currentMatSort);

    // Filter by any search criteria
    this.updateTorrentsBasedOnSearchValue();
    this.updateTorrentsBasedOnFilterValue();
  }

  private updateTorrentSearchValue(val: string): void {
    val = val ?? "";  // In case null is given
    this.torrentSearchValue = GetTorrentSearchName(val);

    // User is searching for something
    this.updateTorrentsBasedOnSearchValue()
  }

  private updateFilterValue(val: TorrentFilter) {
    this.torrentFilterBy = val;

    this.updateTorrentsBasedOnFilterValue();
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
    }
    else if(this.torrentSearchValue === "") {   // If searching for value is empty, restore filteredTorrentData
      this.filteredTorrentData = this.allTorrentData
    }
  }

  updateTorrentsBasedOnFilterValue() {
    // If a filter value is given, then do the work
    if(this.allTorrentData && this.torrentFilterBy) {
      // Sometimes filtered data is empty while not searching, likely a timing issue
      // Super hacky...
      this.filteredTorrentData = (this.filteredTorrentData.length === 0 && this.torrentSearchValue === '' ? this.allTorrentData : this.filteredTorrentData)
      .filter((tor: Torrent) => {
        // Special case for when we consider all torrents
        if(this.torrentFilterBy.value === 'All') return true;

        if(this.torrentFilterBy.type === 'filter_status')
          return Constants.TORRENT_STATE_MAPPING[this.torrentFilterBy.value]?.includes(tor.state);

        if(this.torrentFilterBy.type === 'filter_tracker')
          return this.allTorrentInformation.trackers[this.torrentFilterBy.value].includes(tor.hash)
      });
    }
  }

  handleSortChange(event: any) {
    if(!this.filteredTorrentData) { return; }

    this.currentMatSort = event;

    TorrentHelperService.sortByField(event.active, event.direction, this.filteredTorrentData);
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

  recheckTorrents(tor: Torrent[]) {
    this.data_store.RecheckTorrents(tor).subscribe(res => {
      this.snackbar.enqueueSnackBar(tor.length === 1 ? `Rechecked ${tor[0].name}.` : `Rechecked ${tor.length} torrent(s).`)
    });
  }

  /** Callback for when a torrent is selected in the table. Update row selection service with new data
   * @param event The event thrown.
   */
  handleTorrentSelected(tor: Torrent): void {
    this.selection.toggle(tor);
    this._updateSelectionService();
  }

  /** Callback for when columns are re-ordered in the torrent table. */
  handleColumnReorder(event: any) {
    this.appConfig.setTorrentTableColumns(event.columns, true);
  }

  /** Callback for when table changes col width */
  handleColumnResize(event: any) {
    let colName = event.element.id.replace(/-/g, ' ');
    this.appConfig.setColumnWidth(colName, event.delta);

    // Immediately update preferences in-memory
    this.colWidths = this.appConfig.getWebUISettings().torrent_table.column_widths;
    this.updateTorrentData(this.allTorrentInformation);
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
    let opts: any = { disableClose: true, data: {torrent: tors}, panelClass: "generic-dialog" };

    if(this.isMobileUser) {
      opts = {
        ...opts,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
    }

    this.deleteTorDialogRef = this.deleteTorrentDialog.open(DeleteTorrentDialogComponent, opts);
    this.deleteTorDialogRef.afterClosed().subscribe((result: any) => {
      if (result.attemptedDelete) { this.torrentDeleteFinishCallback() }
    });
  }

  /** Open modal for viewing details torrent information */
  openInfoTorrentDialog(event: any, tor: Torrent): void {
    if(event) { event.stopPropagation(); }
    let opts: any = {data: {torrent: tor}, autoFocus: false, panelClass: "generic-dialog"};

    if(this.isMobileUser) {
      opts = {
        ...opts,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%'
      }
    }

    this.infoTorDialogRef = this.infoTorDialog.open(TorrentInfoDialogComponent, opts)
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

  private setUserPreferences(pref: UserPreferences) {
    this.userPref = pref;

    let torrent_table_pref = pref.web_ui_options?.torrent_table
    let table_sort_opt = torrent_table_pref?.default_sort_order;

    this.currentMatSort = table_sort_opt ? {
      active: table_sort_opt.column_name.replace(/\s/, '_'),
      direction: table_sort_opt.order
    } : this.currentMatSort

    // Column order
    this.displayedColumns = pref.web_ui_options?.torrent_table?.columns_to_show;

    // Want to override defaults
    let oldColWidths = this.colWidths;
    let newColWidths = pref.web_ui_options?.torrent_table?.column_widths
    this.colWidths = { ...oldColWidths, ...newColWidths };

    // Re-sort data
    this.handleSortChange(this.currentMatSort);
  }

  colNameForMapping(col) {
    return this.displayedColumnsMapping[col].name
  }

  public getClassForStatus(t: Torrent): string { return getClassForStatus(t); }

  public isTorrentsEmpty() {
    return this.filteredTorrentData?.length === 0;
  }

  /** Determine if table is loading data or not */
  isLoading(): boolean {
    return this.allTorrentData == null;
  }
}
