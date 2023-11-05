import {Component, Input} from '@angular/core';
import {
  MerchantModel
} from "../../../../../../shared/models/merchant.model";
import {
  MerchantsService
} from "../../../../../../shared/services/merchants.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css']
})
export class DetailAccountComponent {
  merchant: MerchantModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private merchantService: MerchantsService
  ) {
    const merchantId = this.route.snapshot.paramMap.get('id');
    if (merchantId) {
      this.merchant = this.merchantService.getMerchantById(merchantId);
    }
  }

  approveMerchant() {
    this.merchantService.approveMerchant(this.merchant);
    this.router.navigate(['/ministry-dashboard/manage-account']);
  }

  rejectMerchant() {
    this.merchantService.rejectMerchant(this.merchant);
    this.router.navigate(['/ministry-dashboard/manage-account']);
  }
}
