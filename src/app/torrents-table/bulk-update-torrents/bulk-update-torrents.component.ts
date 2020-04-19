import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { Torrent } from 'src/utils/Interfaces';
import { RowSelectionService } from 'src/app/services/torrent-management/row-selection.service';

@Component({
  selector: 'app-bulk-update-torrents',
  templateUrl: './bulk-update-torrents.component.html',
  styleUrls: ['./bulk-update-torrents.component.css']
})
export class BulkUpdateTorrentsComponent implements OnInit {

  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

  public torrentsSelected: string[] = [];
  public canUserEdit: boolean = false;
  private loading: boolean = false;
  private actions: {
    "cancel": () => void,
    "delete": () => void,
    "pause": () => void,
    "play": () => void,
    "increasePrio": () => void,
    "decreasePrio": () => void,
    "maxPrio": () => void,
    "minPrio": () => void
  };

  constructor( private torrentsSelectedService: RowSelectionService ) {

    // Assign all possible actions
    this.actions = {
      "cancel": () => this.onChange.emit("cancel"),
      "delete": () => this.onChange.emit("delete"),
      "pause": () => this.onChange.emit("pause"),
      "play": () => this.onChange.emit("play"),
      "increasePrio": () => this.onChange.emit("increasePrio"),
      "decreasePrio": () => this.onChange.emit("decreasePrio"),
      "maxPrio": () => this.onChange.emit("maxPrio"),
      "minPrio": () => this.onChange.emit("minPrio")
    };
   }

  ngOnInit(): void {

    // Update state when new torrents are selected/un-selected
    this.torrentsSelectedService
    .getTorrentsSelected()
    .subscribe((newTorrents: string[]) => {

      this.torrentsSelected = newTorrents;
    })
  }

  /** Get appropriate message to display in snackbar */
  public getSnackbarMessage(): string {
    let numTorrentsSelected = this.torrentsSelected.length;

    return numTorrentsSelected === 1 ?
        `You have 1 torrent selected.` : `You have ${numTorrentsSelected} torrents selected.`;
  }

  public handleEditAction(): void {
    this.canUserEdit = true;
  }

  public handleBulkActions(action: string): void {
    this.loading = true;
    this.actions[action]();
    this.loading = false;
  }

  public isLoading(): boolean {
    return this.loading;
  }

}
