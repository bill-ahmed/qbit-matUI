import { Injectable } from '@angular/core';
import { MainData, Torrent, GlobalTransferInfo, QbittorrentBuildInfo, TorrentContents, UserPreferences } from 'src/utils/Interfaces';
import { TorrentDataHTTPService } from './torrent-data-http.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { NetworkConnectionInformationService } from '../network/network-connection-information.service';

@Injectable({
  providedIn: 'root'
})
export class TorrentDataStoreService {

  /** A future date that a torrent must be completed by.
   * NOTE: The multiplies '1000' is needed for when we create a new Date() object
   */
  public static FUTURE_MOST_DATE = new Date(32513156400 * 1000);

  /** Milliseconds since epoch the denotes that earliest a torrent can be completed */
  public static CREATED_AT_THRESHOLD = new Date((18000 * 1000) + 1);

  private rawData: any;
  private rid = 0;
  private _torrentMainDataSource = new BehaviorSubject<MainData>(null);

  private TorrentMainData: MainData;
  private _torrentMainDataValue = this._torrentMainDataSource.asObservable();

  private refresh_interval: any;
  private DEFAULT_REFRESH_TIMEOUT: number;

  constructor(private torrent_http_service: TorrentDataHTTPService, private networkInfo: NetworkConnectionInformationService) {
    this.UpdateTorrentData();

    this.DEFAULT_REFRESH_TIMEOUT = this.networkInfo.get_recommended_torrent_refresh_interval();

    this.networkInfo.get_network_change_subscription().subscribe((res) => {

      this.DEFAULT_REFRESH_TIMEOUT = this.networkInfo.get_recommended_torrent_refresh_interval();
      this.updateRefreshInterval(() => this.UpdateTorrentData(), this.DEFAULT_REFRESH_TIMEOUT);

      console.log("updated recommended refresh interval", this.DEFAULT_REFRESH_TIMEOUT);
    });

    this.updateRefreshInterval(() => this.UpdateTorrentData(), this.DEFAULT_REFRESH_TIMEOUT);
  }

  /** Get torrent all torrent data and information
   * @param rid The RID value to send to server, for changelog purposes.
   */
  public async UpdateTorrentData(rid?: number): Promise<MainData> {
    let data = await this.torrent_http_service.GetAllTorrentData(rid || this.rid).toPromise();

    // Only set raw data initially
    if(!this.rawData){
      this.rawData = JSON.parse(JSON.stringify(data));
    }

    // Update state with new
    // TODO: When a torrent gets removed, we need to refresh our data
    this.setFormattedResponse(data);
    this._updateDataSource(this.TorrentMainData);

    this.rid = data.rid;

    return this.TorrentMainData;
  }

  public GetTorrentData(): MainData {
    return this._torrentMainDataSource.value;
  }

  public GetTorrentByID(id: string): Torrent {
    return this.TorrentMainData.torrents.find((tor: Torrent) => {return tor.hash === id})
  }

  /** Get list of torrent whose IDs are supplied. If a torrent
   * with an ID is not found, it is ignored.
   */
  public GetTorrentsByIDs(ids: string[]): Torrent[] {
    let res = [];
    for(const tor of this.TorrentMainData.torrents) {
      if(ids.includes(tor.hash)) { res.push(tor) }
    }

    return res;
  }

  /** Handle uploading torrent files
   * @param files The torrents to upload.
   */
  public async UploadTorrents(files: FileList[], destination: string): Promise<any> {
    return await this.torrent_http_service.UploadNewTorrents(files, destination)
  }

  public UploadTorrentsFromMagnetURLs(urls: string, destination: string): Observable<any> {
    return this.torrent_http_service.UploadNewTorrentsFromMagnetURLs(urls, destination);
  }

  public MoveTorrents(torrents: Torrent[], destination: string): Observable<any> {
    return this.torrent_http_service.MoveTorrents(torrents.map(elem => elem.hash), destination);
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

  public SetUserPreferences(pref: UserPreferences): Observable<any> {
    return this.torrent_http_service.SetPreferences(pref);
  }

  /** Subscribe to torrent data
   *
   */
  public GetTorrentDataSubscription(): Observable<MainData> {
    return this._torrentMainDataValue;
  }

  public async GetApplicationBuildInfo(): Promise<QbittorrentBuildInfo> {
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
      this.updateTorrentChanges(data);
    } else {
      this.TorrentMainData = data;
    }

    // Re-format response
    for(const key of Object.keys(this.rawData.torrents)){
      this.rawData.torrents[key].hash = key;

      if(cleanTorrentData){
        let tor = this.rawData.torrents[key];

        // If there's anything wrong with this torrent, fix it
        this.fixTorrent(tor);
        cleanTorrentData.push(this.rawData.torrents[key]);
      } else {
        cleanTorrentData = [this.rawData.torrents[key]];
      }

    }

    this.TorrentMainData.torrents = cleanTorrentData;
  }

  /**Fix any issues with a torrent */
  private fixTorrent(tor: Torrent) {
    if(new Date(tor.completion_on * 1000) < TorrentDataStoreService.CREATED_AT_THRESHOLD) {
      tor.completion_on = TorrentDataStoreService.FUTURE_MOST_DATE.valueOf() / 1000
    }
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
  private updateTorrentChanges(allData: any) {
    let data = allData.torrents;

    if(!allData || !data) {
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

    //Remove all torrents that were deleted in this changelog
    if(allData.torrents_removed) {
      (allData.torrents_removed as string[]).forEach(id => {
        delete this.rawData.torrents[id];
      });
    }
  }

  /** Set new refresh interval. If none is given, then DEFAULT_REFRESH_TIMEOUT
   * will be used instead
   */
  private updateRefreshInterval(callback: (...args: any[]) => void, interval?: number) {
    let int = interval || this.DEFAULT_REFRESH_TIMEOUT
    if(this.refresh_interval) { clearInterval(this.refresh_interval) }
    this.refresh_interval = setInterval(callback, int)
  }

  /** Delete all data in store
   */
  public ResetAllData(): void {
    this.rawData = null;
    this.TorrentMainData = null;
    this.rid = 0;
  }
}
