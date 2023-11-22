/**
 * This component handles user login functionality, utilizing the AuthService for
 * authentication and navigation, and the NotificationService for displaying login-related messages.
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
   * @param {AuthService} authService - Service for handling user authentication.
   * @param {NotificationService} notificationService - Service for displaying notifications.
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  /**
   * Initializes the login form and retrieves user data for validation purposes.
   */
  ngOnInit(): void {
    this.users = this.authService.getUsersData();

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Getter function for accessing form controls in the template.
   */
  get formControl() {
    return this.loginForm.controls;
  }

  /**
   * Validates the login form, attempts user login using the AuthService,
   * and navigates to the appropriate dashboard based on the user's role.
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
