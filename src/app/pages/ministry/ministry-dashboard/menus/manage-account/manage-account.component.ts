import {Component, OnInit} from '@angular/core';
import {MerchantModel} from '../../../../../shared/models';
import {Router} from '@angular/router';
import {MerchantService} from '../../../../../shared/services';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css'],
})
export class ManageAccountComponent implements OnInit {
  pendingApplications: MerchantModel[] = [];

  constructor(
    private merchantService: MerchantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.merchantService.getPendingApplications()
      .subscribe(
      (merchants: MerchantModel[]) => {
        this.pendingApplications = merchants;
        console.log(this.pendingApplications);
      },
      (error) => {
        console.error('Error fetching pending applications:', error);
      }
    );
  }

  previewMerchant(merchant: MerchantModel) {
      this.router.navigate(['/ministry-dashboard/merchant', merchant._id]);
  }
}
