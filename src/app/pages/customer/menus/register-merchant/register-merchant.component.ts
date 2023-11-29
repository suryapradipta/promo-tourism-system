
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  NotificationService,
  RegisterMerchantsService,
} from '../../../../shared/services';
import { MerchantModel } from '../../../../shared/models';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent implements OnInit {
  public submitted = false;
  merchants: MerchantModel[] = [];

  constructor(
    private merchantService: RegisterMerchantsService,
    private alert: NotificationService
  ) {}

  ngOnInit(): void {
    this.merchants = this.merchantService.getMerchantsData();
  }

  onRegisterMerchant(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const isMerchantRegistered = this.merchantService.registerProfileMerchant(
      form.value.name,
      form.value.phone_number,
      form.value.email,
      form.value.company_description
    );

    if (isMerchantRegistered) {
      this.submitted = true;
      this.alert.showSuccessMessage('Register successful!');
    } else {
      this.alert.showEmailInUseMessage();
      return;
    }
  }

  files: any;
  fileNames = [];

  onGetFile(event: any) {
    this.files = event.target.files;

    for (let i = 0; i < event.target.files.length; i++) {
      this.fileNames.push(event.target.files[i].name);
    }
  }

  onUploadFile(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.merchantService.addDocumentsAndDescription(
      this.fileNames,
      form.value.file_description
    );
    this.fileNames = [];

    this.alert.showApplicationSuccessMessage();
  }
}
