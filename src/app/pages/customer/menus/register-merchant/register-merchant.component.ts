import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {
  LoadingService,
  MerchantService,
  NotificationService,
} from '../../../../shared/services';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent {
  public submitted = false;
  private merchantId: string;
  files: any;

  constructor(
    private merchantService: MerchantService,
    private alert: NotificationService,
    private loading: LoadingService
  ) {}

  onRegisterMerchant(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.loading.show();
    this.merchantService
      .registerMerchant(
        form.value.name,
        form.value.contact_number,
        form.value.email,
        form.value.company_description
      )
      .subscribe(
        (response) => {
          this.loading.hide();
          this.submitted = true;
          this.alert.showSuccessMessage(response.message);
          this.merchantId = response.id;
        },
        (error) => {
          this.loading.hide();
          console.error('Error registering merchant:', error);
          if (error.status === 500 || error.status === 409) {
            this.alert.showEmailInUseMessage();
          } else {
            this.alert.showErrorMessage(
              error.error?.message || 'Registration failed. Please try again.'
            );
          }
        }
      );
  }

  onGetFile(event: any): void {
    this.files = event.target.files;
  }

  onUploadFile(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.loading.show();
    this.merchantService
      .uploadDocuments(this.merchantId, this.files, form.value.file_description)
      .subscribe(
        (response) => {
          this.loading.hide();
          this.submitted = true;
          this.alert.showSuccessMessage(response.message);
        },
        (error) => {
          this.loading.hide();
          console.error('Error uploading documents:', error);
          this.alert.showErrorMessage(
            error.error?.message || 'Error uploading documents.'
          );
        }
      );
  }
}
