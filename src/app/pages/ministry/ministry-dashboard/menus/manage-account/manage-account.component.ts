import { Component } from '@angular/core';
import {
  MerchantsService
} from "../../../../../shared/services/merchants.service";
import {MerchantModel} from "../../../../../shared/models/merchant.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent {
  pendingApplications: MerchantModel[] = [];
  // selectedMerchant: MerchantModel | null = null;


  constructor(private merchantService: MerchantsService, private router: Router) {
    this.pendingApplications = this.merchantService.getPendingApplications();
    // console.log("SELECTED",this.selectedMerchant);
  }

  // selectMerchant(merchant: MerchantModel) {
  //   // this.selectedMerchant = merchant;
  //   console.log("SELECTEDSELECTEDSELECTED",this.selectedMerchant);
  //
  // }

  approveMerchant(merchant: MerchantModel) {
    this.merchantService.approveMerchant(merchant);
    // this.selectedMerchant = null;
    this.merchantService.getPendingApplications();
  }

  rejectMerchant(merchant: MerchantModel) {
    this.merchantService.rejectMerchant(merchant);
    // this.selectedMerchant = null;
    this.merchantService.getPendingApplications();
  }

  previewMerchant(merchant: MerchantModel) {
    this.router.navigate(['/ministry-dashboard/merchant', merchant.id]);
  }
}
