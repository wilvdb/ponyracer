import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

@Component({
  selector: 'pr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authenticationFailed: boolean;
  credentials: { login: ''; password: '' };

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  authenticate() {
    this.userService.authenticate(this.credentials).subscribe(
      () => this.authenticationFailed = true
    );
  }

}
