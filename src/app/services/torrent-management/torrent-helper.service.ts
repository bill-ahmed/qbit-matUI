import { Injectable } from '@angular/core';
import { Torrent } from 'src/utils/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class TorrentHelperService {
  /** Sort a given list of torrents by field name.
   *
   * **NOTE: This will modify the given list of torrents in-place!**
   */
  static sortByField(field: string, direction: string, torrents: Torrent[]): void {
    /** NOTE: All cases that have a space character
     * must ALSO account for the case where the spaces
     * are replaced with underscores.
     *
     * EXAMPLE: "Last Updated At" --> "Last_Updated_At"
     */
    switch (field) {
      case "Name":
        TorrentHelperService.sortTorrentsByName(direction, torrents);
        break;
      case "Completed On":
      case "Completed_On":
        TorrentHelperService.sortTorrentsByCompletedOn(direction, torrents);
        break;
      case "Status":
        TorrentHelperService.sortTorrentsByStatus(direction, torrents);
        break;
      case "Size":
        TorrentHelperService.sortTorrentsBySize(direction, torrents);
        break;
      case "ETA":
        TorrentHelperService.sortByETA(direction, torrents);
        break;
      case "Uploaded":
        TorrentHelperService.sortByUploaded(direction, torrents);
        break;
      case "Ratio":
        TorrentHelperService.sortByRatio(direction, torrents);
        break;
      case "Progress":
        TorrentHelperService._sortByNumber("progress", direction, torrents);
        break;
      case "Down Speed":
      case "Down_Speed":
        TorrentHelperService._sortByNumber("dlspeed", direction, torrents);
        break;
      case "Up Speed":
      case "Up_Speed":
        TorrentHelperService._sortByNumber("upspeed", direction, torrents);
        break;

      case "Added On":
      case "Added_On":
        TorrentHelperService._sortByNumber("added_on", direction, torrents);
        break;

      case "Last Activity":
      case "Last_Activity":
        TorrentHelperService._sortByNumber("last_activity", direction, torrents);
        break;

      default:
        return;
    }
  }

  /** Sort torrents by name in-place */
  static sortTorrentsByName(direction: string, torrents: Torrent[]): void {
    torrents.sort((a: Torrent, b: Torrent) => {
      let res = (a.name === b.name ? 0 : (a.name < b.name ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  /** Sort torrents by completed on date, in-place */
  static sortTorrentsByCompletedOn(direction: string, torrents: Torrent[]): void {
    TorrentHelperService._sortByNumber("completion_on", direction, torrents);
  }

  /** Sort list of torrents by status, in-place */
  static sortTorrentsByStatus(direction: string, torrents: Torrent[]): void {
    torrents.sort((a: Torrent, b: Torrent) => {
      let res = (a.state === b.state ? 0 : (a.state < b.state ? -1 : 1))
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }

  /** Sort torrents by size, in-place */
  static sortTorrentsBySize(direction: string, torrents: Torrent[]): void {
    TorrentHelperService._sortByNumber("size", direction, torrents);
  }

  /** Sort torrents by ETA, in-place */
  static sortByETA(direction: string, torrents: Torrent[]): void {
    TorrentHelperService._sortByNumber("eta", direction, torrents);
  }

  /** Sort torrents by amount uploaded, in-place */
  static sortByUploaded(direction: string, torrents: Torrent[]): void {
    TorrentHelperService._sortByNumber("uploaded", direction, torrents);
  }

  /** Sort torrents by ratio, in-place */
  static sortByRatio(direction: string, torrents: Torrent[]): void {
    TorrentHelperService._sortByNumber("ratio", direction, torrents);
  }

  /** Sort a object's property that is a number, in-place */
  static _sortByNumber(field: string, direction: string, torrents: Torrent[]): void {
    torrents.sort((a: Torrent, b: Torrent) => {
      let res = (a[field] === b[field] ? 0 : (a[field] < b[field] ? -1 : 1))

      // Case when reverse direction is chosen
      if(direction === "desc") { res = res * (-1) }
      return res;
    });
  }
}
