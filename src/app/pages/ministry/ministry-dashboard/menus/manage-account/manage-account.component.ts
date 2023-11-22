/**
 * This component is responsible for displaying and managing pending merchant account applications.
 * It retrieves pending applications from the ManageAccountService and provides a method
 * to preview individual merchant details, allowing navigation to the corresponding merchant dashboard.
 */
import { Component, OnInit } from '@angular/core';
import { MerchantModel } from '../../../../../shared/models';
import { Router } from '@angular/router';
import { ManageAccountService } from '../../../../../shared/services';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css'],
})
export class ManageAccountComponent implements OnInit {
  pendingApplications: MerchantModel[] = [];

  /**
   * Constructor function for ManageAccountComponent.
   *
   * @constructor
   * @param {ManageAccountService} manageAccountService - Service for managing merchant accounts.
   * @param {Router} router - Angular router service for navigation.
   */
  constructor(
    private manageAccountService: ManageAccountService,
    private router: Router
  ) {}

  /**
   * Retrieves pending merchant applications from the service and logs them to the console.
   */
  ngOnInit(): void {
    this.pendingApplications =
      this.manageAccountService.getPendingApplications();
  }

  /**
   * Navigate to the merchant dashboard for a given merchant.
   *
   * @param {MerchantModel} merchant - The merchant whose dashboard is to be previewed.
   */
  previewMerchant(merchant: MerchantModel) {
    this.router.navigate(['/ministry-dashboard/merchant', merchant.id]);
  }
}
