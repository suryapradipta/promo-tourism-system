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

  constructor(
    private merchantService: MerchantService,
    private router: Router,
    private loading: LoadingService
  ) {}

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

  previewMerchant(merchant: Merchant): void {
    this.router.navigate(['/ministry-dashboard/merchant', merchant._id]);
  }
}
