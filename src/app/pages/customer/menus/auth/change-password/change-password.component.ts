import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alert: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

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

  async onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const userEmail = this.authService.getCurrentUserJson().email;
    const currentPassword = this.f.currentPassword.value;
    const newPassword = this.f.newPassword.value;
    const confirmPassword = this.f.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      this.passwordMismatch = true;
      this.alert.showErrorMessage('New password and confirm password must match.');
    } else {
      this.authService.checkPassword(userEmail, currentPassword).subscribe(
        (response) => {
          if (response.isValid) {
            this.authService.updatePassword(userEmail, newPassword).subscribe(
              () => {
                this.passwordMismatch = false;
                this.changePasswordForm.reset();
                this.router.navigate(['/ministry-dashboard'])
                  .then(() => this.alert.showSuccessMessage('Password successfully changed!'));
              },
              (error) => {
                console.error(error);
                this.alert.showErrorMessage('Error updating password.');
              });
          } else {
            this.alert.showErrorMessage('Incorrect current password.');
          }
        },
        (error) => {
          console.error(error);
          this.alert.showErrorMessage('Error checking current password.');
        }
      );
    }
  }


}
