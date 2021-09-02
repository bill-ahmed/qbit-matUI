import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { ApplicationConfigService } from 'src/app/services/app/application-config.service';
import { RowSelectionService } from 'src/app/services/torrent-management/row-selection.service';

@Component({
  selector: 'app-bulk-update-torrents',
  templateUrl: './bulk-update-torrents.component.html',
  styleUrls: ['./bulk-update-torrents.component.scss']
})
export class BulkUpdateTorrentsComponent implements OnInit {

  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

  public torrentsSelected: string[] = [];
  public canUserEdit: boolean = false;

  // ALlow user to change columns that appear
  public allColumns = ApplicationConfigService.ALL_COLUMNS;
  public columnsSelected: string[];

  private loading: boolean = false;
  private actions: {
    "cancel": () => void,
    "delete": () => void,
    "pause": () => void,
    "play": () => void,
    "forceStart": () => void,
    "increasePrio": () => void,
    "decreasePrio": () => void,
    "maxPrio": () => void,
    "minPrio": () => void,
    "moveTor": () => void,
  };

  constructor(private torrentsSelectedService: RowSelectionService, private appConfig: ApplicationConfigService) {

    // Assign all possible actions
    this.actions = {
      "cancel": () => this.onChange.emit("cancel"),
      "delete": () => this.onChange.emit("delete"),
      "pause": () => this.onChange.emit("pause"),
      "play": () => this.onChange.emit("play"),
      "forceStart": () => this.onChange.emit("forceStart"),
      "increasePrio": () => this.onChange.emit("increasePrio"),
      "decreasePrio": () => this.onChange.emit("decreasePrio"),
      "maxPrio": () => this.onChange.emit("maxPrio"),
      "minPrio": () => this.onChange.emit("minPrio"),
      "moveTor": () => this.onChange.emit("moveTorrent")
    };
   }

  ngOnInit(): void {

    // Update state when new torrents are selected/un-selected
    this.torrentsSelectedService
    .getTorrentsSelected()
    .subscribe((newTorrents: string[]) => {

      this.torrentsSelected = newTorrents;
      newTorrents.length === 0 ? this.canUserEdit = false : this.canUserEdit = true;
    });

    this.appConfig.getUserPreferencesSubscription().subscribe(res => {
      this.columnsSelected = res.web_ui_options.torrent_table.columns_to_show;

      // Update allColumns to be in the same order as columnsSelected
      let diff = this.allColumns.filter(elem => !this.columnsSelected.includes(elem));
      this.allColumns = [...this.columnsSelected, ...diff];
    })

    this.columnsSelected = this.appConfig.getWebUISettings().torrent_table.columns_to_show;
  }

  /** Get appropriate message to display in snackbar */
  public getBulkEditMessage(): string {
    let numTorrentsSelected = this.torrentsSelected.length;

    return numTorrentsSelected === 0 ? `` : `${numTorrentsSelected} selected`;
  }

  public handleBulkActions(action: string): void {
    this.loading = true;
    this.actions[action]();
    this.loading = false;
  }

  public handleColumnsChange() {
    this.appConfig.setTorrentTableColumns(this.columnsSelected, true);
  }

  public clearSelectedTorrents(): void {
    this.torrentsSelectedService.clearSelection();
  }

  public isLoading(): boolean {
    return this.loading;
  }

}
