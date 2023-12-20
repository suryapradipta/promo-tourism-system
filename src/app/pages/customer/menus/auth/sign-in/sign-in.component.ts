/**
 * This component handles the user sign-in functionality, including form validation,
 * authentication, and navigation based on the user's role. It communicates with the
 * AuthService for authentication-related operations and utilizes other shared services
 * for notifications and loading indicators.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuthService,
  LoadingService,
  NotificationService,
} from '../../../../../shared/services';
import { Auth } from '../../../../../shared/models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Service for building and managing forms.
   * @param {Router} router - Angular router service for navigation.
   * @param {AuthService} authService - Service for user authentication operations.
   * @param {NotificationService} alert - Service for displaying notifications.
   * @param {LoadingService} loading - Service for managing loading indicators.
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  /**
   * Initializes the login form with validation rules.
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Getter method to access form controls.
   */
  get formControl() {
    return this.loginForm.controls;
  }

  /**
   * Handles the user login process. Validates the form, initiates authentication,
   * and performs appropriate actions based on the authentication result.
   */
  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loading.show();
      this.authService.login(email, password).subscribe(
        (response: { token: string }) => {
          localStorage.setItem('token', response.token);
          this.getCurrentUser();
        },
        (error) => {
          this.loading.hide();
          console.error('Error during loginL ', error);
          if (error.status === 401 || error.status === 400) {
            this.alert.showErrorMessage(
              error.error.message + '. Please try again.'
            );
          } else if (error.status === 500) {
            this.alert.showErrorMessage(
              'Server error. Please try again later.'
            );
          } else {
            this.alert.showErrorMessage(
              error.error?.message ||
                'An unexpected error occurred. Please try again.'
            );
          }
        }
      );
    }
  }

  /**
   * Fetches the currently authenticated user after successful login.
   * Handles the result and initiates further actions based on the user's role.
   *
   * @private
   */
  private getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe(
      (currentUser) => {
        this.loading.hide();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.handleLoginSuccess(currentUser);
      },
      (error) => {
        this.loading.hide();
        console.error('Error fetching current user:', error);
        if (
          error.status === 401 &&
          error.error.message === 'Token has expired'
        ) {
          this.router.navigate(['/login']);
        }
        this.alert.showErrorMessage(
          error.error?.message ||
            'An unexpected error occurred. Please try again.'
        );
      }
    );
  }

  /**
   * Handles the actions to be taken after a successful login, considering the
   * user's role and whether it is their first login.
   *
   * @param {Auth} currentUser - Current authenticated user data.
   * @private
   */
  private handleLoginSuccess(currentUser: Auth): void {
    this.loading.show();
    this.authService.isFirstLogin(currentUser.email).subscribe(
      (isFirstLogin: boolean) => {
        this.loading.hide();
        if (isFirstLogin) {
          this.router
            .navigate(['/change-password'])
            .then(() => this.alert.showSuccessMessage('Login successful!'));
        } else {
          switch (currentUser.role) {
            case 'ministry':
            case 'merchant':
              this.router.navigate(['/ministry-dashboard/home']);
              break;
            case 'customer':
              this.router.navigate(['/']);
              break;
          }
          this.alert.showSuccessMessage('Login successful!');
        }
      },
      (error) => {
        this.loading.hide();
        console.error('Error checking first login status:', error);
        if (error.status === 500) {
          this.alert.showErrorMessage(
            'Internal server error. Please try again later.'
          );
        } else {
          const errorMessage =
            error.error?.message ||
            'Failed to check login status. Please try again later.';
          this.alert.showErrorMessage(errorMessage);
        }
      }
    );
  }
}
