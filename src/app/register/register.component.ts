import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm: FormGroup;
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  birthYearCtrl: FormControl;

  constructor(private builder: FormBuilder) {
  }

  ngOnInit() {
    this.loginCtrl = this.builder.control('', [ Validators.required ]);
    this.passwordCtrl = this.builder.control('', [ Validators.required ]);
    this.birthYearCtrl = this.builder.control('', [ Validators.required ]);
    this.userForm = this.builder.group({
      login: this.loginCtrl,
      password: this.passwordCtrl,
      birthYear: this.birthYearCtrl
      });
  }

  register() {

  }
}
