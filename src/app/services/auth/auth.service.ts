import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IsDevEnv } from 'src/utils/Environment';
import { Observable } from 'rxjs';

import * as http_config from '../../../assets/http_config.json';
import { TorrentDataStoreService } from '../torrent-management/torrent-data-store.service';
import { UserPreferences } from 'src/utils/Interfaces';
import { SnackbarService } from '../notifications/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private COOKIE_KEY = "SID"
  private http_endpoints = http_config.endpoints;

  constructor(
    private cs: CookieService, private router: Router,
    private http: HttpClient, private data_store: TorrentDataStoreService,
    private notification_service: SnackbarService
    ) { }

  /** Get logged in user's cookie. */
  public GetCookie(): string {
    return this.cs.get(this.COOKIE_KEY);
  }

  /** Logout the current user.
   * NOTE: This will change the user's location.
   */
  public async Logout() {
    this.cs.deleteAll();

    await this._sentLogoutRequest();

    if(IsDevEnv())  { this.router.navigate(['/']); }
    else            { window.location.reload(); }
  }

  /** HTTP request to end user's current session */
  private _sentLogoutRequest(): Promise<any> {
    let root = this.http_endpoints.root;
    let endpoint = this.http_endpoints.logout;
    let url = root + endpoint;

    return this.http.post(url, null).toPromise();
  }

  /** Disable the use of alternate Web UI
   *
   * WARNING: This will disable the material UI.
   * The user will have to re-enable it from default web ui or the desktop
   * application again!
   */
  public DisabledAlternateWebUI() {
    // @ts-ignore -- Ignore this error because we only want to modify this preference
    let pref = { alternative_webui_enabled: false } as UserPreferences;
    this.data_store.SetUserPreferences(pref).toPromise()
    .then(() => {
      window.location.reload();
    })
    .catch((err) => {
      this.notification_service.enqueueSnackBar("Unable to disable web UI. Check console log for details.", { type: 'error' })
    });


  }
}
