import { Injectable } from '@angular/core';
import * as _appConfig from '../../app.config.json';
import { QbittorrentBuildInfo } from 'src/utils/Interfaces';
import { TorrentDataStoreService } from '../torrent-management/torrent-data-store.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationConfigService {

  private application_version: string;
  private qBitBuildInfo: QbittorrentBuildInfo;

  constructor(private data_store: TorrentDataStoreService) {
    this.application_version = _appConfig.version;
    this.data_store.GetApplicationBuildInfo()
    .then(res => { this.qBitBuildInfo = res })
    .catch(err => { console.log("Error getting build info", err); this.qBitBuildInfo = { appVersion: 'N/A', apiVersion: 'N/A' } })
  }

  async getQbittorrentBuildInfo(): Promise<QbittorrentBuildInfo> {
    if(!this.qBitBuildInfo) { this.qBitBuildInfo = await this.data_store.GetApplicationBuildInfo(); }

    return this.qBitBuildInfo;
  }

  getApplicationVersion(): string {
    return this.application_version;
  }

  /** A string in the format 'v1.2.3' */
  getApplicationVersionString(): string {
    return `v${this.getApplicationVersion()}`
  }
}
