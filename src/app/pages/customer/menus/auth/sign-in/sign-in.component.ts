import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {AuthService} from "../../../../../shared/services";
import {AuthModel} from "../../../../../shared/models";
import {NotificationService} from "../../../../../shared/services";


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
              private authService: AuthService,
              private notificationService:NotificationService) {
  }

  ngOnInit(): void {
    this.users = this.authService.getUsersData();

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
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
        this.notificationService.showSuccessMessage('Login successful!');
      } else {
        this.notificationService.showErrorMessage('Login failed. Please check your credentials.');
      }
    }
  }

}
