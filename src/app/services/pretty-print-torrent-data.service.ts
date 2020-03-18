import { Injectable } from '@angular/core';
import { UnitsHelperService } from './units-helper.service';
import { Torrent } from 'src/utils/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class PrettyPrintTorrentDataService {

  constructor( private UnitConversion: UnitsHelperService ) { }

  /** Get nice string version of status
   * e.g. "forcedUP" => "Seeding", "pausedDL" => "Paused", etc.
   * 
   */
  pretty_print_status(status: string): string {
    let statusMapping = {
      forcedUP: "Seeding",
      error: "Error",
      pausedUP :"Paused",
      pausedDL: "Paused",
      queuedUP: "Queued",
      queuedDL: "Queued",
      uploading: "Seeding",
      stalledUP: "Stalled",
      stalledDL: "Stalled",
      checkingUP: "Loading...",
      checkingDL: "Loading...",
      downloading: "Downloading",
      metaDL: "Loading...",
    }

    return statusMapping[status] || "UNKNOWN";
  }

  pretty_print_file_size(size: number): string {
    return this.UnitConversion.GetFileSizeString(size);
  }

  pretty_print_eta(tor: Torrent): string {
    let result = "∞";

    if(!tor.completion_on) {
      result = this.UnitConversion.GetSecondsString(tor.eta);
    }
    return result;
  }

  pretty_print_completed_on(timestamp: number): string {
    let dateCompleted = "";

    if(timestamp) {
      dateCompleted =  this.UnitConversion.GetDateString(timestamp);
    }
    return dateCompleted;
  }


}
