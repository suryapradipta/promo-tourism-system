import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {
  SignUpService
} from "../../../../../shared/services/sign-up.service";
import {AuthModel} from "../../../../../shared/models/auth.model";

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
              private usersService: SignUpService,) {
  }

  ngOnInit(): void {
    this.users = this.usersService.getUsersData();

    this.registerForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  // Form validation control
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

        this.handleRegistrationSuccess()
      } else {
        this.handleEmailInUse()
      }
    } else {
      this.handleInvalidForm();
    }
  }


  private handleInvalidForm = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Register failed. Please check your credentials.',
    });
  };

  private handleEmailInUse = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Email Already in Use',
      text: 'The email address you provided is already registered in our system. Please use a different email address.',
    });
  };

  private handleRegistrationSuccess = (): void => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Register successful!',
      showConfirmButton: false,
      timer: 1500
    });
  };
}
