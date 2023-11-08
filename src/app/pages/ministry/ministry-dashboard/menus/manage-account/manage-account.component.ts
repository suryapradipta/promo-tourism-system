import {Component, OnInit} from '@angular/core';
import {MerchantModel} from "../../../../../shared/models";
import {Router} from "@angular/router";
import {
  ManageAccountService
} from "../../../../../shared/services";

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
    console.log("PENDING APP", this.pendingApplications)
  }

  previewMerchant(merchant: MerchantModel) {
    this.router.navigate(['/ministry-dashboard/merchant', merchant.id]);
  }
}
