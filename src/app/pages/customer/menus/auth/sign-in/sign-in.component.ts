import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuthService,
  LoadingService,
  NotificationService,
} from '../../../../../shared/services';
import { AuthModel } from '../../../../../shared/models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

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
          console.error("Error during loginL ", error);
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

  private handleLoginSuccess(currentUser: AuthModel): void {
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
