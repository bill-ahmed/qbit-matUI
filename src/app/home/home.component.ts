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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  private cookieSID: string;
  private isPageLoading: boolean;

  constructor(private router: Router, private cs: CookieService, public addTorrentDialog: MatDialog) { }

  ngOnInit(): void {
    this.isPageLoading = true;

    // Grab cookie information
    let key = GetCookieInfo().SIDKey;
    this.cookieSID = this.cs.get(key);

    if(this.cookieSID === ""){
      this.logout();
    }
  }

  /** Open the modal for adding a new torrent */
  openAddTorrentDialog(): void {
    const addTorDialogRef = this.addTorrentDialog.open(AddTorrentDialogComponent);

    addTorDialogRef.afterClosed().subscribe((result: any) => {
      this.handleAddTorrentDialogClosed(result);
    });
  }

  /** Callback for when user is finished uploading a torrent */
  handleAddTorrentDialogClosed(data: any): void {
    console.log('Dialog closed:', data);
  }

  logout(): void {
    this.cs.deleteAll();
    this.router.navigate(['/']);
  }

}
