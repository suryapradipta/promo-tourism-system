/**
 * This component handles user sign-in functionality, including form validation,
 * authentication, and navigation based on user roles.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../../shared/services';
import { AuthModel } from '../../../../../shared/models';
import { NotificationService } from '../../../../../shared/services';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  users: AuthModel[] = [];

  /**
   * Constructor function for SignInComponent.
   *
   * @constructor
   * @param {FormBuilder} formBuilder - Angular service for building and managing forms.
   * @param {Router} router - Angular service for navigating between views.
   * @param {AuthService} authService - Service responsible for user authentication.
   * @param {NotificationService} notificationService - Service for displaying notifications.
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  /**
   * Initializes the login form and retrieves user data.
   */
  ngOnInit(): void {
    this.users = this.authService.getUsersData();

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Getter function to easily access form controls.
   */
  get formControl() {
    return this.loginForm.controls;
  }

  /**
   * If the form is valid, attempts to authenticate the user and navigates
   * based on the user's role. Displays appropriate notifications.
   */
  onLogin(): void {
    if (this.loginForm.valid) {
      const user = this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );

      if (user !== null) {
        switch (user.role) {
          case 'ministry':
          case 'merchant':
            if (this.authService.isFirstLogin(this.loginForm.value.email)) {
              this.router.navigate(['/change-password']);
            } else {
              this.router.navigate(['/ministry-dashboard']);
            }
            break;
          case 'customer':
            this.router.navigate(['/']);
            break;
        }
        this.notificationService.showSuccessMessage('Login successful!');
      } else {
        this.notificationService.showErrorMessage(
          'Login failed. Please check your credentials.'
        );
      }
    }
  }
}
