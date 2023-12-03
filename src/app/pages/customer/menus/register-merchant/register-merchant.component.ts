
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  MerchantService,
  NotificationService,
  RegisterMerchantsService,
} from '../../../../shared/services';
import { MerchantModel } from '../../../../shared/models';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent{
  public submitted = false;
  private merchantId: string;
  files: any;

  constructor(
    private merchantService: MerchantService,
    private alert: NotificationService
  ) {}


  onRegisterMerchant(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.merchantService.registerMerchant(
      form.value.name,
      form.value.contact_number,
      form.value.email,
      form.value.company_description
    ).subscribe(
      (response) => {
        this.submitted = true;
        this.alert.showSuccessMessage(response.message);
        this.merchantId = response.id;
      },
      (error) => {
        console.error(error);
        if (error.status === 500 || error.status === 409) {
          this.alert.showErrorMessage('Email is already registered');
        } else {
          this.alert.showErrorMessage(error.error.message);
        }
      }
    );
  }

  onGetFile(event: any) {
    this.files = event.target.files;
  }

  onUploadFile(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.merchantService.uploadDocuments(
      this.merchantId,
      this.files,
      form.value.file_description
    ).subscribe(
      (response) => {
        this.submitted = true;
        this.alert.showSuccessMessage(response.message);
      },
      (error) => {
        console.error(error);
        this.alert.showErrorMessage(error.error.message);
      }
    );
  }
}
