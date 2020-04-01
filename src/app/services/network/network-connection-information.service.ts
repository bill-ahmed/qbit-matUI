import { Injectable } from '@angular/core';
import { NetworkType, NetworkConnection } from 'src/utils/Interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionInformationService {

  /** Recommended refresh interval for fetching new torrent data */
  private network_info = new BehaviorSubject<NetworkConnection>(null);
  private network_info_sub = this.network_info.asObservable();
  private torrent_refresh_interval: number = 1000                         // Assume fastest connection

  constructor() { 
    // @ts-ignore -- Ignoring because most browsers do support it; if they don't, we won't use it.
    let con = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
    if(con) {
      con.onchange = (event: any) => this.handle_network_change(event);
    }
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

  private handle_network_change(event: any) {
    let network_change: NetworkConnection = event.target;
    
    this.torrent_refresh_interval = this.get_refresh_interval_from_network_type(network_change.effectiveType);
    this.network_info.next(network_change);
  }

  /** Calculates an appropriate refresh interval based on user's 
   * current internet connection type
   */
  private get_refresh_interval_from_network_type(net_type: NetworkType): number {

    let result = 1000;

    switch (net_type) {
      case "slow-2g":
        result = 8000;
        break;
    
      case "2g":
        result = 5000;
        break;

      case "3g":
        result = 3000;
        break;

      case "4g":
        break;

      default:
        break;
    }

    return result;
  }
}
