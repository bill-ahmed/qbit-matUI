import { Injectable } from '@angular/core';
import { NetworkType, NetworkConnection } from 'src/utils/Interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationConfigService } from '../app/application-config.service';

@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionInformationService {
  static DEFAULT_REFRESH_INTERVAL = 1500;

  /** Recommended refresh interval for fetching new torrent data */
  private network_info = new BehaviorSubject<NetworkConnection>(null);
  private network_info_sub = this.network_info.asObservable();
  private torrent_refresh_interval = NetworkConnectionInformationService.DEFAULT_REFRESH_INTERVAL;    // Assume fastest connection
  private auto_mode = true;                                                                                   // Whether the interval should be calculated automatically or not

  constructor() {
    // @ts-ignore -- Ignoring because most browsers do support it; if they don't, we won't use it.
    let con = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
    if(con) {
      con.onchange = (event: any) => this.handle_network_change(event);
    }
  }

  public getRefreshInterval(): number {
    return this.torrent_refresh_interval;
  }

  public get_recommended_torrent_refresh_interval(): number {
    return this.torrent_refresh_interval;
  }

  /** Returns the type of connection a user is on.
   *
   * E.g. 2g, 3g, 4g, etc.
   */
  public get_connection_type(): NetworkType {
    return this.network_info.value.effectiveType;
  }

  public get_network_change_subscription(): Observable<NetworkConnection> {
    return this.network_info_sub;
  }

  /** Override the existing refresh interval. If auto-mode is enabled, then
   * this interval may be overrided again in the future!
   */
  public setRefreshInterval(interval: number) {
    console.log('set refresh interval of', interval)
    this.torrent_refresh_interval = interval;
    this.network_info.next(this.network_info.value);
  }

  /** Will stop getting new network information. Use this
   * before overriding the refresh interval.
   */
  public disableAutoMode() {
    this.auto_mode = false;
  }

  /** Calculates an appropriate refresh interval based on user's
   * current internet connection type
   */
  public get_refresh_interval_from_network_type(net_type: NetworkType | "slowest" | "slow" | "medium" | "fastest"): number {

    let result = 1500;

    switch (net_type) {
      case "slowest":
      case "slow-2g":
        result = 8000;
        break;

      case "slow":
      case "2g":
        result = 5000;
        break;

      case "medium":
      case "3g":
        result = 2000;
        break;

      case "fastest":
      case "4g":
        break;

      default:
        break;
    }

    return result;
  }

  private handle_network_change(event: any) {
    let network_change: NetworkConnection = event.target;

    this.torrent_refresh_interval = this.get_refresh_interval_from_network_type(network_change.effectiveType);

    // Only refresh if user wants auto mode
    if(this.auto_mode) { this.network_info.next(network_change); }
  }
}
