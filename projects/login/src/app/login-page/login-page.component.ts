import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as http_config from '../../assets/http_config.json';
import { IsDevEnv } from '../../utils/Environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  username: string = "";
  password: string = "";

  loading = false;
  http_endpoints: any;

  form_controls = {
    username: new FormControl(this.username),
    password: new FormControl(this.password)
  }

  constructor(private http: HttpClient) { this.http_endpoints = http_config.endpoints; }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    this.loading = true;

    console.log({username: this.username, password: this.password});
    let root = this.http_endpoints.root;
    let endpoint = this.http_endpoints.login;
    let url = root + endpoint;

    let body = new FormData();
    body.append('username', this.username);
    body.append('password', this.password);

    // Do not send cookies in dev mode
    let options = IsDevEnv() ? { } : { withCredentials: true }

    try {
      let result = await this.http.post<any>(url, body, options).toPromise();
      console.log(result)
    } catch (error) {
      // If 403, then too many login attmepts
    } finally {
      this.loading = false;
    }
  }

}
