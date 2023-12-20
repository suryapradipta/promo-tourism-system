/**
 * This component handles the change password functionality, allowing users to update their passwords.
 * It utilizes the AuthService for user authentication and password management,
 * FormBuilder for form creation, NotificationService for displaying alerts,
 * and LoadingService for displaying loading indicators during asynchronous operations.
 */
import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  LoadingService,
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
   * @constructor
   * @param {AuthService} authService - The service for user authentication and password management.
   * @param {Router} router - The Angular router for navigating between views.
   * @param {FormBuilder} fb - The FormBuilder for creating and managing forms.
   * @param {NotificationService} alert - The service for displaying alerts.
   * @param {LoadingService} loading - The service for displaying loading indicators.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  /**
   * Initializes the change password form with validators.
   */
  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /**
   * Get method to access form controls.
   */
  get formControl() {
    return this.changePasswordForm.controls;
  }

  /**
   * Handles the form submission to change the user's password.
   * Validates form inputs, checks for password match, and communicates with the AuthService
   * to verify the current password and update the password if conditions are met.
   */
  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const userEmail = this.authService.getCurrentUserJson().email;
    const currentPassword = this.formControl.currentPassword.value;
    const newPassword = this.formControl.newPassword.value;
    const confirmPassword = this.formControl.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      this.passwordMismatch = true;
      this.alert.showErrorMessage(
        'New password and confirm password must match.'
      );
    } else {
      this.loading.show();
      this.authService.checkPassword(userEmail, currentPassword).subscribe(
        (isValid: boolean) => {
          if (isValid) {
            this.authService.updatePassword(userEmail, newPassword).subscribe(
              (response) => {
                this.loading.hide();
                this.passwordMismatch = false;
                this.changePasswordForm.reset();
                this.router
                  .navigate(['/ministry-dashboard/home'])
                  .then(() => this.alert.showSuccessMessage(response.message));
              },
              (error) => {
                this.loading.hide();
                console.error('Error updating password:', error);
                this.alert.showErrorMessage(
                  error.error?.message || 'An unexpected error occurred'
                );
              }
            );
          } else {
            this.loading.hide();
            this.alert.showErrorMessage('Incorrect current password.');
          }
        },
        (error) => {
          this.loading.hide();
          console.error(error);
          this.alert.showErrorMessage('Error checking current password.');
        }
      );
    }
  }
}
