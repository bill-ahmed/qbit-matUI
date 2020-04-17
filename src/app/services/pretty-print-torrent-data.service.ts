import { Injectable } from '@angular/core';
import { UnitsHelperService } from './units-helper.service';
import { Torrent } from 'src/utils/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class PrettyPrintTorrentDataService {

  /** A future date that a torrent must be completed by.
   * NOTE: The multiplies '1000' is needed for when we create a new Date() object
   */
  private FUTURE_MOST_DATE = 32513156400 * 1000;

  /** Number of seconds after which we consider a torrent to take infinite time.
   * 8640000 seconds = 100 days
   */
  private ETA_THRESHOLD = 8640000;

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

    if(tor.eta && tor.eta < this.ETA_THRESHOLD) {
      result = this.UnitConversion.GetSecondsString(tor.eta);
    }
    return result;
  }

  pretty_print_completed_on(timestamp: number): string {
    let dateCompleted = "";
    let completedYear = new Date(timestamp * 1000).getUTCFullYear();

    /** If timestamp is from before or at 1970, or fat in the future, then torrent is still downloading.
     *
     * Need to do this because some Qbittorrent versions will use a date close to epoch
     * to denote a future completion date (or some date in the far future)
     *
     * TODO: Near the end of the year 2099, update this :P
     * */
    if(completedYear <= 1970 || completedYear >= 2100) {
      return "TBD"
    }

    if(timestamp) {
      dateCompleted =  this.UnitConversion.GetDateString(timestamp);
    }

    return dateCompleted;
  }
}
