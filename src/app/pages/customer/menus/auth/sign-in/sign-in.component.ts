import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'

import {AuthService} from "../../../../../shared/services/auth.service";
import {AuthModel} from "../../../../../shared/models/auth.model";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  users: AuthModel[] = [];


  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.users = this.authService.getUsersData();

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required,]]
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }


  onLogin(): void {
    if (this.loginForm.valid) {

      const user = this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password);

      if (user !== null) {
        switch (user.role) {
          case 'ministry':
          case 'merchant':
            this.router.navigate(['/ministry-dashboard'])
            break;
          case 'customer':
            this.router.navigate(["/"]);
            break;
        }
        this.handleLoginSuccess();
      } else {
        this.handLoginFailed();
      }
    }
  }

  private handLoginFailed = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Login failed. Please check your credentials.',
    })
  };
  private handleLoginSuccess = (): void => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Login successful!',
      showConfirmButton: false,
      timer: 1500
    })
  };


}
