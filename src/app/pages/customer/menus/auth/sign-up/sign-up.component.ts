import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {
  AuthService,
  NotificationService,
} from '../../../../../shared/services';
import {AuthModel} from '../../../../../shared/models';

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
    private alert: NotificationService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
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

        return isValid ? null : {invalidPassword: true};
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

  get formControl() {
    return this.registerForm.controls;
  }

  onRegister(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.authService.createUser(
        this.registerForm.value.email,
        this.registerForm.value.password,
        'customer'
      ).subscribe(
        (response) => {
          this.router.navigate(['/sign-in']).then(() =>
            this.alert.showSuccessMessage(response.message)
          );
        },
        (error) => {
          if (error.status === 400 || error.status === 422) {
            this.alert.showErrorMessage(error.error.message);
          } else if (error.status === 409) {
            this.alert.showEmailInUseMessage();
          } else {
            this.alert.showErrorMessage('User account creation failed. Please try again later.');
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
