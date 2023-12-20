/**
 * ManageAccountComponent
 *
 * This component is responsible for displaying and managing pending merchant applications
 * for approval by the ministry. It retrieves pending applications from the MerchantService,
 * displays them, and allows the ministry to preview individual merchant details.
 */
import { Component, OnInit } from '@angular/core';
import { Merchant } from '../../../../../shared/models';
import { Router } from '@angular/router';
import {
  LoadingService,
  MerchantService,
} from '../../../../../shared/services';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css'],
})
export class ManageAccountComponent implements OnInit {
  pendingApplications: Merchant[] = [];

  /**
   * @constructor
   * @param {MerchantService} merchantService - Service for interacting with merchant-related data.
   * @param {Router} router - Angular router service for navigation.
   * @param {LoadingService} loading - Service for managing loading indicators.
   */
  constructor(
    private merchantService: MerchantService,
    private router: Router,
    private loading: LoadingService
  ) {}

  /**
   * Retrieves and displays pending merchant applications from the MerchantService.
   */
  ngOnInit(): void {
    this.loading.show();
    this.merchantService.getPendingApplications().subscribe(
      (merchants: Merchant[]) => {
        this.loading.hide();
        this.pendingApplications = merchants;
      },
      (error) => {
        this.loading.hide();
        console.error('Error fetching pending applications:', error);
      }
    );
  }

  /**
   * Navigate to the detailed view of a specific merchant.
   *
   * @param {Merchant} merchant - The merchant whose details are to be previewed.
   */
  previewMerchant(merchant: Merchant): void {
    this.router.navigate(['/ministry-dashboard/merchant', merchant._id]);
  }
}
