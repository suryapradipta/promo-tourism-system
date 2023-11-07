import {Component, OnInit} from '@angular/core';
import {
  MerchantsService
} from "../../../../../shared/services/merchants.service";
import {MerchantModel} from "../../../../../shared/models/merchant.model";
import {Router} from "@angular/router";
import {
  ManageAccountService
} from "../../../../../shared/services/manage-account.service";

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit{

  pendingApplications: MerchantModel[] = [];

  constructor(
    private manageAccountService: ManageAccountService,
    private router: Router) {}

  ngOnInit(): void {
    this.pendingApplications = this.manageAccountService.getPendingApplications();
  }

  previewMerchant(merchant: MerchantModel) {
    this.router.navigate(['/ministry-dashboard/merchant', merchant.id]);
  }
}
