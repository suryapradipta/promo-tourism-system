import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  isAuth: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}"
          )
        ]
      ]
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }


  onLogin(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      localStorage.setItem("user-Data", JSON.stringify(this.loginForm.value));
      if(this.loginForm.value.email=="admin@prs.com" && this.loginForm.value.password=="Admin123*") {
        this.isAuth = true;
        this.router.navigate(['/ministry-dashboard'])
      } else {
        this.isAuth = true;
        this.router.navigate(["/"]);
      }
      this.loginForm.reset();

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
