import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
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

  loginForm: FormGroup;
  incorrect_creds = false;
  loading = false;

  http_endpoints: any;

  common_validations = [Validators.required];

  form_controls = {
    username: new FormControl(this.username, [...this.common_validations]),
    password: new FormControl(this.password, [...this.common_validations])
  }

  constructor(private http: HttpClient, private fb: FormBuilder) { this.http_endpoints = http_config.endpoints; }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [...this.common_validations],
      password: [...this.common_validations]
    });
  }

  async login(): Promise<void> {
    this.loading = true;
    this.incorrect_creds = false;

    console.log({username: this.username, password: this.password});
    let root = this.http_endpoints.root;
    let endpoint = this.http_endpoints.login;
    let url = root + endpoint;

    let body = new FormData();
    body.append('username', this.username);
    body.append('password', this.password);

    // Do not send cookies in dev mode
    let options = { responseType: 'text', withCredentials: true }

    try {
      //@ts-ignore
      let result = await this.http.post(url, body, options).toPromise() as String;

      if(result === 'Fails.') { this.incorrect_creds = true; this.loading = false; }
      else                    { window.location.reload(); }
    }
    catch (error) {
      // If 403, then too many login attmepts
      console.log("got error", error);
      alert("Too many login attempts!");
      window.location.reload();
    }
  }

}
