import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GetCookieInfo } from '../../utils/ClientInfo';
import { HttpClient } from '@angular/common/http';
import { HttpConfigType } from '../../utils/Interfaces';
import * as http_endpoints from '../../assets/http_config.json';
import { Router } from '@angular/router';

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

    let body = new FormData();
    body.append('username', username);
    body.append('password', password);

    let url = root + endpoint;

    let xhr = new XMLHttpRequest();

    // xhr.open('POST', url, true);
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
    // xhr.addEventListener('readystatechange', function() {
    //     if (xhr.readyState === 4) { // DONE state
    //         if (xhr.status === 200){
    //           alert("done");
    //         }
    //         else{
    //           alert("else");
    //         }
                
    //     }
    // });

    // const queryString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    // xhr.send(queryString);
    console.log(url)
    this.http.post(url, body).subscribe((data: any) => console.log(data));
  }

}
