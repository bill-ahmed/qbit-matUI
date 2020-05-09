import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import * as http_endpoints from '../../assets/http_config.json';
import { IsDevEnv } from '../../utils/Environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private http_endpoints: any;
  private cookieValueSID: string

  constructor(private router: Router, private cookieService: CookieService, private http: HttpClient) { this.http_endpoints = http_endpoints }

  ngOnInit(): void {
  }

  /**Handle any errors with login
   * @param response The response given by server.
   */
  handleAuthErrors(response: any): void {
    alert("Error logging in.");
    this.cookieService.deleteAll(); // Clear all cookies and refresh page
    window.location.reload();
  }

  /**Exceptions when contacting server
   * @param error The error thrown.
   */
  handleAuthExceptions(error: any){
    alert("There was an error logging in. Check console logs for details.");
    console.log(error);
  }

  /**Login a user. Will set a cookie with appropriate credentials */
  login(): void {

    // Grab username/password info
    let usernameField: any = document.getElementById('username');
    let passwordField: any = document.getElementById('password');

    let username = (usernameField.value as string).trim()
    let password = (passwordField.value as string)

    if (username.length === 0) { alert("Username can't be empty!"); return; };
    if (password.length === 0) { alert("Password can't be empty!"); return; };

    // POST request to get cookie
    let root = this.http_endpoints.default.endpoints.root;
    let endpoint = this.http_endpoints.default.endpoints.login;

    // body parameters
    let body = new FormData();
    body.append('username', username);
    body.append('password', password);

    let url = root + endpoint;

    let xhr = new XMLHttpRequest();

    console.log("Sent request to", url)
    try {
      this.http.post(url, body, {responseType: 'text', observe: 'response'}).subscribe(
        (data: any) => {

          // If successful, route to home page
          if(data.status === 200 && data.body === "Ok."){

            // When in development/testing, set cookie manually because Express server won't do it for some reason RIP IDK
            if(IsDevEnv()){
              this.cookieService.set('SID', this.http_endpoints.default.devCookie);
            }

            this.router.navigate(['/home']);

          } else {
            this.handleAuthErrors(data);
          }
          console.log(data)
      });

    } catch (error) {
      this.handleAuthExceptions(error);
    }
  }

}
