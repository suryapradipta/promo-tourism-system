/**
 * This component handles the user registration functionality, providing a form
 * for users to sign up. It includes email and password validation, and upon successful
 * registration, navigates the user to the sign-in page.
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
  NotificationService,
  SignUpService,
} from '../../../../../shared/services';
import { AuthModel } from '../../../../../shared/models';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  users: AuthModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: SignUpService,
    private alert: NotificationService,



    private authService: AuthService,
  ) {}

  /**
   * Initializes the user data, sets up form validation, and controls.
   */
  ngOnInit(): void {
    this.users = this.userService.getUsersData();

    // Custom password validator function
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
   * Getter function to access form controls easily.
   */
  get formControl() {
    return this.registerForm.controls;
  }

  /**
   * Validates the form, registers the user, and navigates to the sign-in page upon success.
   */
  onRegister(): void {
    this.submitted = true;
    if (this.registerForm.valid) {

      this.authService.createUser(
        this.registerForm.value.email,
        this.registerForm.value.password,
        'customer'
      ).subscribe(
        () => {
          this.router.navigate(['/sign-in']);
          this.alert.showSuccessMessage('Register successful!');
        },
        (error) => {
          if (error.status === 500) {
            this.alert.showEmailInUseMessage();
          } else {
            this.alert.showErrorMessage('Register failed. Please try again later.');
          }
        }
      );



      /*if (isUserRegistered) {
        this.router.navigate(['/sign-in']);

        this.alert.showSuccessMessage('Register successful!');
      } else {
        this.alert.showEmailInUseMessage();
      }*/
    } else {
      this.alert.showErrorMessage(
        'Register failed. Please check your credentials.'
      );
    }
  }
}
