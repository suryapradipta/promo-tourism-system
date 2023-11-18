import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {
  NotificationService,
  SignUpService
} from "../../../../../shared/services";
import {AuthModel} from "../../../../../shared/models";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  users: AuthModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private usersService: SignUpService,
              private notificationService:NotificationService) {
  }

  ngOnInit(): void {
    this.users = this.usersService.getUsersData();

    function passwordValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        const password = control.value;

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);

        const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

        return isValid ? null : { invalidPassword: true };
      };
    }

    this.registerForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), passwordValidator()]],
    });
  }

  get formControl() {
    return this.registerForm.controls;
  }

  onRegister(): void {
    this.submitted = true;
    if (this.registerForm.valid) {

      const isUserRegistered = this.usersService.register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        'customer');

      if (isUserRegistered) {
        this.router.navigate(["/sign-in"]);

        this.notificationService.showSuccessMessage('Register successful!')
      } else {
        this.notificationService.showEmailInUseMessage();
      }
    } else {
      this.notificationService.showErrorMessage('Register failed. Please check your credentials.');
    }
  }
}
