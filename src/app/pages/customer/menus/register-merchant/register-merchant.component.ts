import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {MerchantsService} from "../../../../shared/services/merchants.service";
import {MerchantModel} from "../../../../shared/models/merchant.model";

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css']
})
export class RegisterMerchantComponent implements OnInit{

  public submitted = false;
  merchants: MerchantModel[]=[];

  constructor(private merchantService: MerchantsService) {}

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
    )

    if(isMerchantRegistered) {
      this.submitted = true;
      this.handleRegistrationSuccess();
    } else {
      this.handleEmailInUse();
      return;
    }
  }

  private handleRegistrationSuccess = (): void => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Register successful!',
      showConfirmButton: false,
      timer: 1500
    });
  };
  private handleEmailInUse = (): void => {
    Swal.fire({
      icon: 'error',
      title: 'Email Already in Use',
      text: 'The email address you provided is already registered in our system. Please use a different email address.',
    });
  };

  files: any;
  fileNames = [];
  getFile(event: any) {
    this.files = event.target.files;

    for (let i = 0; i < event.target.files.length; i++) {
      this.fileNames.push(event.target.files[i].name);
    }
    // console.log("filename:", this.file[0].name)
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

    Swal.fire({
      icon: 'success',
      title: 'Register successful!',
      text:'The form has been successfully submitted. Please wait for approval from the officer.',
      showConfirmButton: true,
    })

  }
}
