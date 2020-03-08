import { Component, OnInit } from '@angular/core';
import { GetSID } from '../../utils/UserInfo';

@Component({
  selector: 'app-torrents-table',
  templateUrl: './torrents-table.component.html',
  styleUrls: ['./torrents-table.component.css']
})
export class TorrentsTableComponent implements OnInit {
  private cookieValueSID: string;

  constructor() { }

  ngOnInit(): void {
    this.cookieValueSID = GetSID();
  }

}
