/**
 * This component is responsible for displaying the details of a merchant account and provides
 * actions for approving or rejecting the merchant. It uses the ManageAccountService to retrieve
 * merchant data and perform approval or rejection operations.
 */
import { Component, OnInit } from '@angular/core';
import { MerchantModel } from '../../../../../../shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageAccountService } from '../../../../../../shared/services';

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css'],
})
export class DetailAccountComponent implements OnInit {
  merchant: MerchantModel | null = null;

  /**
   * Constructor function for DetailAccountComponent.
   *
   * @constructor
   * @param {ActivatedRoute} route - Angular service for retrieving route-related information.
   * @param {Router} router - Angular service for navigating between views.
   * @param {ManageAccountService} manageAccountService - Service for managing merchant accounts.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manageAccountService: ManageAccountService
  ) {}

  /**
   * Retrieves the merchant ID from the route parameters and loads the corresponding
   * merchant data using the ManageAccountService.
   */
  ngOnInit(): void {
    const merchantId = this.route.snapshot.paramMap.get('id');
    if (merchantId) {
      this.merchant = this.manageAccountService.getMerchantById(merchantId);
    }
  }

  /**
   * Calls the ManageAccountService to perform the approval operation and navigates
   * back to the manage account dashboard.
   */
  onApproveMerchant() {
    this.manageAccountService.approveMerchant(this.merchant);
    this.router.navigate(['/ministry-dashboard/manage-account']);
  }

  /**
   * Calls the ManageAccountService to perform the rejection operation and navigates
   * back to the manage account dashboard.
   */
  onRejectMerchant() {
    this.manageAccountService.rejectMerchant(this.merchant);
    this.router.navigate(['/ministry-dashboard/manage-account']);
  }
}
