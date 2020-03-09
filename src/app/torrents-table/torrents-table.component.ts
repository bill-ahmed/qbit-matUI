import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { HttpConfigType } from '../../utils/Interfaces';
import * as http_endpoints from '../../assets/http_config.json';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  public allTorrentData = [];
  public cookieValueSID: string;
  private http_endpoints: any;

  constructor(private cookieService: CookieService, private http: HttpClient) { 
    this.cookieService = cookieService;
    this.http = http;
    this.http_endpoints = http_endpoints
  }

  ngOnInit(): void {
    let cookieInfo = GetCookieInfo()
    this.cookieValueSID = this.cookieService.get(cookieInfo.SIDKey);
    
    if (this.cookieValueSID === "") {
      this.cookieValueSID = "EMPTY"
      //this.cookieService.set("SID", this.cookieValueSID, new Date(2050, 12, 12), "/", "qbit.billahmed.com", false, "None")
      this.cookieService.set("SID", this.cookieValueSID);
    }
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
    this.http.get(url).subscribe((data: any) => console.log(data));
  }

}
