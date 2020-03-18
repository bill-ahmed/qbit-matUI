import { Injectable } from '@angular/core';
import { MainData, Torrent, GlobalTransferInfo } from 'src/utils/Interfaces';
import { TorrentDataHTTPService } from './torrent-data-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TorrentDataStoreService {

  private rawData: any;
  private TorrentMainData: MainData;

  constructor(private torrent_http_service: TorrentDataHTTPService) { }

  /** Get torrent all torrent data and information
   * @param rid The RID value to send to server, for changelog purposes.
   */
  public async GetTorrentData(rid: number): Promise<any> {
    let data = await this.torrent_http_service.GetAllTorrentData(rid).toPromise();

    // Only set raw data initially
    if(!this.rawData){
      this.rawData = JSON.parse(JSON.stringify(data));
    }

    // Update state with new 
    // TODO: When a torrent gets removed, we need to refresh our data
    this.setFormattedResponse(data);

    return this.TorrentMainData;
  }

  /** Handle uploading torrent files
   * @param files The torrents to upload.
   */
  public async UploadTorrents(files: FileList[], destination: string): Promise<any> {
    return await this.torrent_http_service.UploadNewTorrents(files, destination)
  }

  /** Clean the response given from server */
  private setFormattedResponse(data: MainData) {

    let cleanTorrentData: [Torrent];

    // (1) If we already have some data, update it
    if(this.TorrentMainData) {
      this.updateServerStatus(data.server_state);
      this.updateTorrentChanges(data.torrents);
    } else {
      this.TorrentMainData = data;
    }

    // Re-format response
    for(const key of Object.keys(this.rawData.torrents)){
      this.rawData.torrents[key].hash = key;

      if(cleanTorrentData){
        cleanTorrentData.push(this.rawData.torrents[key]);
      } else {
        cleanTorrentData = [this.rawData.torrents[key]];
      }
      
    }

    this.TorrentMainData.torrents = cleanTorrentData;
  }

  /** Update server status in changelog */
  private updateServerStatus(data: GlobalTransferInfo): void {
    if(!data) {
      return;
    }

    for(const key of Object.keys(data)){
      this.rawData.server_state[key] = data[key];
    }
  }

  /** Handle partial changes to torrent information.
   * For example, if only the download speed & ETA change, this will
   * update only the ones affected.
   */
  private updateTorrentChanges(data: any) {
    if(!data) {
      return;
    }

    for(const key of Object.keys(data)){
      let torID = key;

      // If this torrent is new, create space for it
      if(!this.rawData.torrents[torID]) {
        this.rawData.torrents[torID] = {};
      }

      if(data[torID]){
        for(const torKey of Object.keys(data[torID])){
          this.rawData.torrents[torID][torKey] = data[torID][torKey]; 
        }
      }
    }
  }

  /** Delete all data in store
   * 
   * CAUTION: MAKE SURE THAT (RID = 0) IS SENT AS THE NEXT REQUEST...or else
   */
  public ResetAllData(): void {
    this.rawData = null;
    this.TorrentMainData = null;
  }
}
