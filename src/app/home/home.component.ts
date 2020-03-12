import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  private cookieSID: string;
  private isPageLoading: boolean;

  constructor(private router: Router, private cs: CookieService) { }

  ngOnInit(): void {
    this.isPageLoading = true;

    // Grab cookie information
    let key = GetCookieInfo().SIDKey;
    this.cookieSID = this.cs.get(key);

    if(this.cookieSID === ""){
      this.logout();
    }
  }

  logout(): void {
    this.cs.deleteAll();
    this.router.navigate(['/']);
  }

}
