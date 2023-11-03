import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import Swal from "sweetalert2";
import {MerchantService} from "./shared/merchant.service";

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css']
})
export class RegisterMerchantComponent {


  public submitted = false;
  constructor(public merchantService: MerchantService) {
  }

  onRegisterMerchant(form: NgForm) {
    if (form.invalid) {
      return;
    }
    for (let merchant of this.merchantService.getMerchants()) {
      if (merchant.email === form.value.email) {
        Swal.fire({
          icon: 'error',
          title: 'Email Already in Use',
          text: 'The email address you provided is already registered in our system. Please use a different email address.',
        })
        return;
      }
    }

    this.merchantService.addProfileMerchants(
      form.value.name,
      form.value.phone_number,
      form.value.email,
      form.value.company_description
    );
    this.submitted = true;

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Register successful!',
      showConfirmButton: false,
      timer: 1500
    })
  }


  file: any;

  getFile(event: any) {
    this.file = event.target.files;
    // console.log("filename:", this.file[0].name)
  }

  onUploadFile(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.merchantService.addDocumentsAndDescription(
      this.file,
      form.value.file_description
    );

    Swal.fire({
      icon: 'success',
      title: 'Register successful!',
      text:'The form has been successfully submitted. Please wait for approval from the officer.',
      showConfirmButton: true,
    })
  }
}
