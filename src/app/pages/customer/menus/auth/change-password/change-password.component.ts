import { Component } from '@angular/core';
import {
  AuthService,
  NotificationService
} from "../../../../../shared/services";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  passwordMismatch: boolean = false;

  constructor(private authService: AuthService,
              private router:Router,
              private fb: FormBuilder,
              private alert:NotificationService) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get f() {
    return this.changePasswordForm.controls;
  }


  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const userEmail = this.authService.getCurrentUser().email;

    const currentPassword = this.f.currentPassword.value;
    const newPassword = this.f.newPassword.value;
    const confirmPassword = this.f.confirmPassword.value;


    if (newPassword !== confirmPassword) {
      this.passwordMismatch = true;
      this.alert.showErrorMessage('New password and confirm password must match.')
    } else {
      // Call your authService to check and update the password
      if (this.authService.checkPassword(userEmail, currentPassword)) {
        this.authService.updatePassword(userEmail, newPassword);
        this.passwordMismatch = false;
        this.changePasswordForm.reset();
        this.router.navigate(['/ministry-dashboard']);
        this.alert.showSuccessMessage('Password successfully changed!')
      } else {
        this.alert.showErrorMessage('Incorrect current password.')
      }
    }


  }
}