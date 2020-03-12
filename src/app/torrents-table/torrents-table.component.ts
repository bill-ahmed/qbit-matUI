import { Component, OnInit, isDevMode } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { HttpConfigType, MainData } from '../../utils/Interfaces';
import * as http_endpoints from '../../assets/http_config.json';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentData : MainData;
  public cookieValueSID: string;
  private http_endpoints: any;

  constructor(private cookieService: CookieService, private http: HttpClient) { 
    this.http_endpoints = http_endpoints
  }

  ngOnInit(): void {
    let cookieInfo = GetCookieInfo()
    this.cookieValueSID = this.cookieService.get(cookieInfo.SIDKey);
    // this.getAllTorrents();
  }

  setCookie(): void{
    this.cookieValueSID = "NEW VALUE";
  }

  /**Get all torrent data */
  getAllTorrents(): void{
    let root = this.http_endpoints.default.endpoints.root;
    let endpoint = this.http_endpoints.default.endpoints.torrentList;
    let url = root + endpoint
    console.log(url)

    // Do not send cookies in dev mode
    let options = isDevMode() ? { } : { withCredentials: true }
   
    this.http.get<MainData>(url, options)
    .subscribe((data: MainData) => 
    {
      console.log(data);

    });
  }

}
