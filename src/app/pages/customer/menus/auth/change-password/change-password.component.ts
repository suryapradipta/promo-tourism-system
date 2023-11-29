/**
 * This component handles the functionality for changing the user's password.
 * It includes a form to input the current password, new password, and confirm password,
 * and performs validation and password change based on user input.
 */
import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  NotificationService,
} from '../../../../../shared/services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  passwordMismatch: boolean = false;

  /**
   * Constructor function for ChangePasswordComponent.
   *
   * @constructor
   * @param {AuthService} authService - The service managing user authentication.
   * @param {Router} router - Angular router service for navigation.
   * @param {FormBuilder} fb - Angular form builder for form creation.
   * @param {NotificationService} alert - Service for displaying notifications.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alert: NotificationService
  ) {}

  /**
   * Initializes the form with validation rules for input fields.
   */
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /**
   * Getter function to easily access form controls in the template.
   */
  get f() {
    return this.changePasswordForm.controls;
  }

  /**
   * Validates the form, checks for password mismatch, and updates the user's password
   * if the current password is correct.
   */
  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const userEmail = this.authService.getCurrentUserJson().email;
    const currentPassword = this.f.currentPassword.value;
    const newPassword = this.f.newPassword.value;
    const confirmPassword = this.f.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      this.passwordMismatch = true;
      this.alert.showErrorMessage(
        'New password and confirm password must match.'
      );
    } else {
      if (this.authService.checkPassword(userEmail, currentPassword)) {
        this.authService.updatePassword(userEmail, newPassword);
        this.passwordMismatch = false;
        this.changePasswordForm.reset();
        this.router
          .navigate(['/ministry-dashboard'])
          .then((r) =>
            this.alert.showSuccessMessage('Password successfully changed!')
          );
      } else {
        this.alert.showErrorMessage('Incorrect current password.');
      }
    }
  }
}
