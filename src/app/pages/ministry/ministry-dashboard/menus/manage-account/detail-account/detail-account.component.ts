import {Component, Input, OnInit} from '@angular/core';
import {
  MerchantModel
} from "../../../../../../shared/models/merchant.model";
import {
  RegisterMerchantsService
} from "../../../../../../shared/services/register-merchants.service";
import {ActivatedRoute, Router} from "@angular/router";
import {
  ManageAccountService
} from "../../../../../../shared/services/manage-account.service";

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css']
})
export class DetailAccountComponent implements OnInit{
  merchant: MerchantModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manageAccountService: ManageAccountService
  ) {}

  ngOnInit(): void {
    const merchantId = this.route.snapshot.paramMap.get('id');
    if (merchantId) {
      this.merchant = this.manageAccountService.getMerchantById(merchantId);
    }
  }

  onApproveMerchant() {
    this.manageAccountService.approveMerchant(this.merchant);
    this.router.navigate(['/ministry-dashboard/manage-account']);
  }

  onRejectMerchant() {
    this.manageAccountService.rejectMerchant(this.merchant);
    this.router.navigate(['/ministry-dashboard/manage-account']);
  }
}
