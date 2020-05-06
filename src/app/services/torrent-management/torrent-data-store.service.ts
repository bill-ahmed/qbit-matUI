import { Injectable } from '@angular/core';
import { MainData, Torrent, GlobalTransferInfo, ApplicationBuildInfo, TorrentContents } from 'src/utils/Interfaces';
import { TorrentDataHTTPService } from './torrent-data-http.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TorrentDataStoreService {

  private rawData: any;
  private _torrentMainDataSource = new BehaviorSubject<MainData>(null);

  private TorrentMainData: MainData;
  private _torrentMainDataValue = this._torrentMainDataSource.asObservable();

  constructor(private torrent_http_service: TorrentDataHTTPService) { }

  /** Get torrent all torrent data and information
   * @param rid The RID value to send to server, for changelog purposes.
   */
  public async GetTorrentData(rid: number): Promise<MainData> {
    let data = await this.torrent_http_service.GetAllTorrentData(rid).toPromise();

    // Only set raw data initially
    if(!this.rawData){
      this.rawData = JSON.parse(JSON.stringify(data));
    }

    // Update state with new
    // TODO: When a torrent gets removed, we need to refresh our data
    this.setFormattedResponse(data);
    this._updateDataSource(this.TorrentMainData);

    return this.TorrentMainData;
  }

  /** Handle uploading torrent files
   * @param files The torrents to upload.
   */
  public async UploadTorrents(files: FileList[], destination: string): Promise<any> {
    return await this.torrent_http_service.UploadNewTorrents(files, destination)
  }

  public PauseTorrents(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.PauseTorrents(tor.map(elem => elem.hash));
  }

  public ResumeTorrents(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.PlayTorrents(tor.map(elem => elem.hash));
  }

  public ForceStartTorrents(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.ForceStartTorrents(tor.map(elem => elem.hash));
  }

  public IncreaseTorrentPriority(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.IncreaseTorrentPriority(tor.map(elem => elem.hash))
  }

  public DecreaseTorrentPriority(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.DecreaseTorrentPriority(tor.map(elem => elem.hash))
  }

  public AssignTopPriority(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.SetMaximumPriority(tor.map(elem => elem.hash));
  }

  public AssignLowestPriority(tor: Torrent[]): Observable<any> {
    return this.torrent_http_service.SetMinimumPriority(tor.map(elem => elem.hash));
  }

  /** Subscribe to torrent data
   *
   */
  public GetTorrentDataSubscription(): Observable<MainData> {
    return this._torrentMainDataValue;
  }

  public async GetApplicationBuildInfo(): Promise<ApplicationBuildInfo> {
    return await this.torrent_http_service.GetApplicationBuildInfo();
  }

  public GetTorrentContents(tor: Torrent): Observable<TorrentContents[]> {
    return this.torrent_http_service.GetTorrentContents(tor.hash);
  }

  /** Update observable with new data */
  private _updateDataSource(source: MainData): void {
    this._torrentMainDataSource.next(source);
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
      this.TorrentMainData.server_state[key] = data[key];
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
