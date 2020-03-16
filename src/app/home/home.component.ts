import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { Router } from '@angular/router';

// UI Components
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddTorrentDialogComponent } from '../add-torrent-dialog/add-torrent-dialog.component';
import { SearchTorrentsComponent } from './search-torrents/search-torrents.component';

// Utils
import * as http_endpoints from '../../assets/http_config.json';
import { HttpClient } from '@angular/common/http';
import { IsDevEnv } from '../../utils/Environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  private cookieSID: string;
  private isPageLoading: boolean;
  private http_endpoints: any;

  constructor(private router: Router, private cs: CookieService, private http: HttpClient, public addTorrentDialog: MatDialog) {
    this.http_endpoints = http_endpoints
   }

  ngOnInit(): void {
    this.isPageLoading = true;

    // Grab cookie information
    let key = GetCookieInfo().SIDKey;
    this.cookieSID = this.cs.get(key);

    if(this.cookieSID === ""){
      this.logout();
    }

    // Get user preferences
    this.getUserPreferences();
  }

  /** Open the modal for adding a new torrent */
  openAddTorrentDialog(): void {
    const addTorDialogRef = this.addTorrentDialog.open(AddTorrentDialogComponent, {disableClose: true});

    addTorDialogRef.afterClosed().subscribe((result: any) => {
      this.handleAddTorrentDialogClosed(result);
    });
  }

  /** Callback for when user is finished uploading a torrent */
  handleAddTorrentDialogClosed(data: any): void {
    console.log('Dialog closed:', data);
  }

  private getUserPreferences(): void {

    let root = this.http_endpoints.default.endpoints.root;
    let endpoint = this.http_endpoints.default.endpoints.userPreferences;
    let url = root + endpoint;

    // Do not send cookies in dev mode
    let options = IsDevEnv() ? { } : { withCredentials: true }

    this.http.get(url, options)
    .subscribe((data: any) => 
    {
      this.persistUserPreferences(data);
    });
  }

  /** Store user preferences in local storage */
  private persistUserPreferences(data: any): void {
    localStorage.setItem("preferences", JSON.stringify(data));
  }

  logout(): void {
    this.cs.deleteAll();
    this.router.navigate(['/']);
  }

}
