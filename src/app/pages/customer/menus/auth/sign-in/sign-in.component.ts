import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {
  AuthService,
  NotificationService
} from '../../../../../shared/services';
import {AuthModel} from '../../../../../shared/models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  users: AuthModel[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alert: NotificationService
  ) {
  }

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
      const {email, password} = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          this.getCurrentUser();
        },
        (error) => {
          console.error(error);
          if (error.status === 401 || error.status === 400) {
            this.alert.showErrorMessage(error.error.message + '. Please try again.');
          } else if (error.status === 500) {
            this.alert.showErrorMessage('Server error. Please try again later.');
          } else {
            this.alert.showErrorMessage(error.error?.message || 'An unexpected error occurred. Please try again.');
          }
        });
    }
  }

  private getCurrentUser(): void {
    this.authService.getCurrentUser().subscribe((currentUser) => {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.handleLoginSuccess(currentUser);
      }, (error) => {
        console.error('Error fetching current user:', error);
        if (error.status === 401 && error.error.message === 'Token has expired') {
          this.router.navigate(['/login']);
        }
        this.alert.showErrorMessage(error.error?.message || 'An unexpected error occurred. Please try again.');
      }
    );
  }

  private handleLoginSuccess(currentUser: AuthModel): void {
    this.authService.isFirstLogin(currentUser.email).subscribe(
      (isFirstLogin) => {
        if (isFirstLogin) {
          this.router.navigate(['/change-password']).then(() =>
            this.alert.showSuccessMessage('Login successful!')
          );
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
          this.alert.showSuccessMessage('Login successful!')
        }
      },
      (error) => {
        console.error(error);
        this.alert.showErrorMessage('Error checking first login status.');
      });
  }
}
