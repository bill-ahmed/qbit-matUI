import { Injectable } from '@angular/core';
import { NetworkType, NetworkConnection } from 'src/utils/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class NetworkConnectionInformationService {

  /** Recommended refresh interval for fetching new torrent data */
  private torrent_refresh_interval: number = 1000;
  private current_connection_type: NetworkType = "4g" // Assume fastest connection

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
    return this.current_connection_type;
  }

  private handle_network_change(event: any) {
    let network_change: NetworkConnection = event.target;
    
    this.torrent_refresh_interval = 0;
  }

  /** Calculates an appropriate refresh interval based on user's 
   * current internet connection type
   */
  private get_refresh_interval_from_network_type(): number {
    return 1000;
  }
}
