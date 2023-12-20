/**
 * This component is responsible for handling user registration. It utilizes Angular Reactive Forms
 * to create a form for user input, including custom password validation. Upon successful registration,
 * the user is redirected to the sign-in page. Error messages are displayed for various registration
 * failure scenarios, such as invalid credentials or an email address already in use.
 */
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthService,
  LoadingService,
  NotificationService,
} from '../../../../../shared/services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  /**
   * @constructor
   * @param {FormBuilder} formBuilder - Angular service for building and managing forms.
   * @param {Router} router - Angular service for navigating between views.
   * @param {NotificationService} alert - Service for displaying user notifications.
   * @param {AuthService} authService - Service for user authentication operations.
   * @param {LoadingService} loading - Service for displaying loading indicators during operations.
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alert: NotificationService,
    private authService: AuthService,
    private loading: LoadingService
  ) {}

  /**
   * Sets up the registration form with validators for email and password.
   */
  ngOnInit(): void {
    function passwordValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const password = control.value;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        const isValid =
          hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

        return isValid ? null : { invalidPassword: true };
      };
    }

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), passwordValidator()],
      ],
    });
  }

  /**
   * Getter method to access form controls in the template.
   */
  get formControl() {
    return this.registerForm.controls;
  }

  /**
   * Handles the user registration process.
   * If the registration form is valid, the user is created using the AuthService,
   * and appropriate actions are taken based on the response or error received.
   * Displays relevant error messages for different failure scenarios.
   */
  onRegister(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.loading.show();
      this.authService
        .createUser(
          this.registerForm.value.email,
          this.registerForm.value.password,
          'customer'
        )
        .subscribe(
          (response) => {
            this.loading.hide();
            this.router
              .navigate(['/sign-in'])
              .then(() => this.alert.showSuccessMessage(response.message));
          },
          (error) => {
            this.loading.hide();

            if (error.status === 400 || error.status === 422) {
              this.alert.showErrorMessage(error.error.message);
            } else if (error.status === 409) {
              this.alert.showEmailInUseMessage();
            } else {
              this.alert.showErrorMessage(
                'User account creation failed. Please try again later.'
              );
            }
          }
        );
    } else {
      this.alert.showErrorMessage(
        'Register failed. Please check your credentials.'
      );
    }
  }
}
