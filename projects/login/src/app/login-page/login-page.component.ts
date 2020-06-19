import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  username: string = "";
  password: string = "";

  form_controls = {
    username: new FormControl(this.username),
    password: new FormControl(this.password)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
