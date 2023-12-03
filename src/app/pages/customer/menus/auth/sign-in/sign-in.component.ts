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

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        const {email, password} = this.loginForm.value;
        const response = await this.authService.login(email, password).toPromise();
        localStorage.setItem('token', response.token);

        const currentUser = await this.authService.getCurrentUser().toPromise();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        this.handleLoginSuccess(currentUser);

      } catch (error) {
        console.error(error);
        this.alert.showErrorMessage('Login failed. Please check your credentials.');
      }
    }
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
              this.router.navigate(['/ministry-dashboard']);
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
