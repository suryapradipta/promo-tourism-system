import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {SignUpService} from "../../../../../shared/services/sign-up.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router,
              private registrationService: SignUpService,) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ["", [ Validators.required]],
      password: [
        "",
        [
          Validators.required,

        ]
      ]

    });
  }

  get formControl() {
    return this.registerForm.controls;
  }


  onRegister(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log("REGISTERD EMAIL", this.registerForm.value.email)
      console.log("REGISTERD PASS", this.registerForm.value.password)

      if (this.registrationService.register(this.registerForm.value.email, this.registerForm.value.password)) {
        this.router.navigate(['/login']); // Redirect to the login page
      } else {
        // Handle registration error (username already taken, etc.)
      }
      this.router.navigate(["/sign-in"]);

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Register successful!',
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Register failed. Please check your credentials.',
      })
    }
  }
}
