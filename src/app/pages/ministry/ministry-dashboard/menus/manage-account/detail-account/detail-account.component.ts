import {Component, OnInit} from '@angular/core';
import {MerchantModel} from '../../../../../../shared/models';
import {ActivatedRoute, Router} from '@angular/router';
import {
  MerchantService,
  NotificationService
} from '../../../../../../shared/services';

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.css'],
})
export class DetailAccountComponent implements OnInit {
  merchant: MerchantModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private merchantService: MerchantService,
    private alert: NotificationService
  ) {
  }

  ngOnInit(): void {
    const merchantId = this.route.snapshot.paramMap.get('id');

    if (merchantId) {
      this.merchantService.getMerchantById(merchantId).subscribe(
        (merchant) => {
          this.merchant = merchant;
        },
        (error) => {
          console.error('Error fetching merchant:', error);
        }
      );
    }
  }

  approveMerchant(merchantId: string): void {
    this.merchantService.approveMerchant(merchantId).subscribe(
      () => {
        this.alert.showSuccessMessage('Merchant approved successfully!');
        this.router.navigate(['/ministry-dashboard/manage-account']);
      },
      (error) => {
        this.alert.showErrorMessage('Failed to approve merchant');
        console.error(error);
      }
    );
  }

  rejectMerchant(merchantId: string): void {
    this.merchantService.rejectMerchant(merchantId).subscribe(
      () => {
        this.router.navigate(['/ministry-dashboard/manage-account']).then(r =>
          this.alert.showSuccessMessage('Merchant rejected successfully!')
        );
      },
      (error) => {
        this.alert.showErrorMessage('Failed to reject merchant');
        console.error(error);
      }
    );
  }
}
