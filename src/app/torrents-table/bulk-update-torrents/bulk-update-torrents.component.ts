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
    "play": () => void
  };

  constructor( private torrentsSelectedService: RowSelectionService ) {

    // Assign all possible actions
    this.actions = {
      "cancel": () => this.onChange.emit("cancel"),
      "delete": () => this.onChange.emit("delete"),
      "pause": () => this.onChange.emit("pause"),
      "play": () => this.onChange.emit("play")
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

    // Make the mat-card much bigger
    let container = document.getElementById('bulk-update-container');
    let matCard = document.getElementById('bulk-update-card');
    let matCardContent = document.getElementById('bulkd-update-card-content');

    container.style.background = "rgba(0,0,0,0.32)";
    container.style.pointerEvents = "all";

    matCard.classList.toggle("grow");

    matCardContent.style.flexDirection = "column";
    matCardContent.style.justifyContent = "unset";
    matCardContent.style.alignItems = "unset";
    matCardContent.style.marginLeft = "16px";
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
