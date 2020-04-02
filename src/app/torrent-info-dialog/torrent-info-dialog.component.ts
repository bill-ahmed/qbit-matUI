import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Torrent } from 'src/utils/Interfaces';
import { UnitsHelperService } from '../services/units-helper.service';
import { PrettyPrintTorrentDataService } from '../services/pretty-print-torrent-data.service';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-torrent-info-dialog',
  templateUrl: './torrent-info-dialog.component.html',
  styleUrls: ['./torrent-info-dialog.component.css']
})
export class TorrentInfoDialogComponent implements OnInit {

  public torrent: Torrent = null;
  public isDarkTheme: Observable<boolean>;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private units_helper: UnitsHelperService, private pp: PrettyPrintTorrentDataService, private theme: ThemeService) { 
    this.torrent = data.torrent;
  }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    console.log(this.torrent);
  }

  added_on(): string {
    return this.units_helper.GetDateString(this.torrent.added_on);
  }

  completed_on(): string {
    return this.pp.pretty_print_completed_on(this.torrent.completion_on);
  }

  last_activity(): string {
    return this.pp.pretty_print_completed_on(this.torrent.last_activity)
  }

  total_size(): string {
    return this.units_helper.GetFileSizeString(this.torrent.total_size);
  }

  downloaded(): string {
    return this.units_helper.GetFileSizeString(this.torrent.downloaded);
  }

  state(): string {
    return this.pp.pretty_print_status(this.torrent.state);
  }

}
