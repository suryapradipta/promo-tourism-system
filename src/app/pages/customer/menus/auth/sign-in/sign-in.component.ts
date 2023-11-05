import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'
import {AuthService} from "../../../../../shared/services/auth.service";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  isAuth: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService:AuthService) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [ Validators.required]],
      password: ["", [Validators.required,]]
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }


  onLogin(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      const user = this.authService.login(this.loginForm.value.email, this.loginForm.value.password);

      if(user) {
        if(user.role === 'ministry' ||user.role === 'merchant')
          this.router.navigate(['/ministry-dashboard'])
        else if(user.role==='customer')
          this.router.navigate(["/"]);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login successful!',
          showConfirmButton: false,
          timer: 1500
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Login failed. Please check your credentials.',
        })
      }




    }
  }



}
